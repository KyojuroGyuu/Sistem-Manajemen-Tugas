import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(403).json({message: "Akses ditolak, silahkan login terlebih dahulu"})
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//Validasi role admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({message: "Hanya admin yang dapat mengakses"})
    }
    next();
}