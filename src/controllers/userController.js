import prisma from '../prisma/prisma.js'
import { registerValidate } from '../utils/validation.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser =  async (req, res) => {
    const {error} = registerValidate(req.body);
    if (error) return res.status(401).json({message: error.details[0].message})
    
    const {fullname, username, email, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password, salt);

        const user =  await prisma.user.create({
            data: {
                fullname: fullname,
                username: username,
                email: email,
                password: hashedPassword
            }
        })

        res.json({message: "Register berhasil", data: user})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const loginUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const user =  await prisma.user.findUnique({
            where: {username: username, email: email}
        })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({message: "Wrong password"})
        }

        const token = jwt.sign (
            {id: user.id, username: user.username, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        );

        res.json({message: "Login berhasil",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

