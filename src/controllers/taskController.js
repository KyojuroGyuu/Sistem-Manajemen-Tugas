import prisma from '../prisma/prisma.js';
import { taskValidate, userTaskValidate } from '../utils/validation.js';

//Membuat tugas baru
export const newTask =  async (req, res) => {
    const {error} = taskValidate(req.body);
    if (error) return res.status(401).json({message: error.details[0].message})

    const {title, description, adminId} = req.body;
    try {
        const users = await prisma.user.findMany({
            where: {role: ('USER')},
            select: {id: true}
        })

        const tasks = await prisma.task.create({
            data: {
                title: title,
                description: description,
                createdBy: adminId,
                assignedTo : {
                    create: users.map(user => ({
                        userId: user.id,
                        isCompleted: false
                    }))
                }
            }
        })

        res.status(200).json({message: "Tugas baru berhasil dibuat", data: tasks})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//User melihat apakah ada tugas atau tidak
export const userGetTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const getTask = await prisma.userTask.findMany({
            where: {userId: Number(userId)},
            include: {task: true}
        })

        if (getTask.length === 0) { 
            return res.status(404).json({message: "Tugas tidak ditemukan atau belum dibuat"})
        }

        res.json(getTask)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//User menjawab atau mengerjakan tugas yang diberikan
export const userAnswerTasks = async (req, res) => {
    const {error} = userTaskValidate(req.body);
    if (error) return res.status(403).json({message: error.details[0].message})

    const userLog = req.user.id;
    const {taskId, response} = req.body;
    const folderName = req.file?.mimetype.startsWith('images/') ? 'images' : 'files';
    const fileName = req.file? req.file.filename: null;
    const filePath = req.file? `${folderName}/${fileName}`: null; 

    try {
        const updateTask = await prisma.userTask.update({
            where: {userId_taskId : {
                userId: Number(userLog),
                taskId: Number(taskId)
            }},
            data: {
                response: response,
                file: filePath,
                isCompleted: true
            }
        })

        if (!updateTask) {
            return res.status(404).json({message: "Tidak ada tugas yang bisa dikerjakan"})
        }

        res.status(200).json({
            message: "Tugas berhasil dikumpulkan",
            data: updateTask,
            file: {
                name: fileName,
                path: filePath,
                type: req.file?.mimetype
            }
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }    
}

//Admin mengecek siapa saja yang sudah mengerjakan tugas
export const adminCheckTasks = async (req, res) => {
    const {id} = req.params;

    try {
        const progressTask = await prisma.task.findUnique({
            where: {id: Number(id)},
            include: {
                assignedTo: {
                    include: {
                        user: {
                            select: {username: true}
                        }
                    }
                }
            }
        })

        if (!progressTask) {
            return res.status(404).json({message: "Tugas tidak ditemukan"})
        }

        const stats = {
            totalAssigned: progressTask.assignedTo.length,
            completed: progressTask.assignedTo.filter(u => u.isCompleted).length
        }

        const detailsWithUrl = progressTask.assignedTo.map(submission => {
            return {
                ...submission,
                fileUrl: submission.file 
                    ? `${req.protocol}://${req.get('host')}/uploads/${submission.file}` 
                    : null
            }
        })

        res.json({
            stats,
            taskInfo: {
                id: progressTask.id,
                title: progressTask.title,
                description: progressTask.description
            },
            details: detailsWithUrl
        })

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//Menghapus tugas yg dikhususkan untuk admin
export const deleteTask = async (req, res) => {
    const {id} = req.body;

    try {
        const task = await prisma.task.delete({
            where: {id: Number(id)}
        })

        if (!task) {
            return req.status(404).json({message: "Tugas tidak ditemukan"})
        }

        res.json({message: "Tugas berhasil dihapus", data: task})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}