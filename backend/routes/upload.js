const express = require('express');

const multer = require('multer');



const {protect, adminPrivilages} = require('../middleware/auth');

const {fileUpload} = require('../controller/upload')

const path = require('path')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const checkFiletype = (file, cb) => {
    const types = /jpg|jpeg|webp|png/
    const extname = types.test(path.extname(file.originalname).toLowerCase());
    const mimeType = types.test(file.mimetype);

    if(extname && mimeType) {
        return cb(null, true)
    } else {
        cb({message: 'unsupported file format'}, false);
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFiletype(file, cb)
    },
    limits: {fileSize: 1024 * 1024 * 3}
})

router.route('/').post(protect, adminPrivilages, upload.array('image'), fileUpload)

module.exports = router;