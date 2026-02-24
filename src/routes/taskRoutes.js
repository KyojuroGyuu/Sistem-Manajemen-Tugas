import express from 'express';
import { newTask, userGetTasks, userAnswerTasks, adminCheckTasks, deleteTask } from '../controllers/taskController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { upload, handleUploadError } from '../middleware/authUpload.js';

const router = express.Router();

router.post('/tasks', verifyToken, isAdmin, newTask);
router.get('/user-task', verifyToken, userGetTasks);
router.patch('/user-task/confirm', verifyToken, upload.single('file'), handleUploadError, userAnswerTasks);
router.delete('/tasks/delete', verifyToken, isAdmin, deleteTask);
router.get('/tasks/:id/progress', verifyToken, isAdmin, adminCheckTasks);

export default router;