import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/files';

        if (file.mimetype.startsWith('image/')) {
            folder = 'uploads/images';
        }

        cb(null, folder)
    },
    filename: (req, file, cb) =>  {
        const timeStamp = new Date().getDate();
        const fileName = file.originalname.replace(/\s+/g, '-');
        cb(null, `${timeStamp}-${fileName}`);
    }
})

const fileFilter = (req, file, cb) => {
    // Batasi ukuran file maksimal 5MB
    if (file.size > 5 * 1024 * 1024) {
        return cb(new Error('File terlalu besar. Maksimal 5MB'), false);
    }
    cb(null, true);
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Error handler middleware untuk multer
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(413).json({message: "File terlalu besar. Maksimal 5MB"});
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({message: "Hanya 1 file yang dapat diupload"});
        }
        return res.status(400).json({message: `Error upload: ${err.message}`});
    } else if (err) {
        return res.status(400).json({message: err.message});
    }
    next();
};