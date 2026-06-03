const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = "uploads";

// Auto create uploads folder
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

// File Filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {

        cb(null, true);

    } else {

        cb(new Error("Only jpeg, jpg, png, webp images allowed"));

    }

};

// Multer Upload
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }

});

module.exports = upload;