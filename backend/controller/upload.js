const cloudinary = require('cloudinary');
const asyncHandler = require('express-async-handler');

const fs = require('fs')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url:result.url,
                id:result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}

exports.fileUpload = asyncHandler( async(req, res, next) => {
    const uploader = async (path) => await uploads(path, 'Images');

    if(req.method === 'POST') {
        const urls = [];
        const files = req.files;

        for(const file of files ) {
            const { path } = file;
            const newPath = await uploader(path);

            urls.push(newPath);

            fs.unlinkSync(path);
        }

        res.status(200).json({
            message: 'Image uploaded successfully',
            result: urls
        })
    } else {
        res.status(405).json({
            message: `${req.method} method not allowed`
        })
    }
})

// method2
exports.uploadAvatar = async(req, res, next) => {
    try {
        const file = req.files.file;

        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'avatar', width: 150, height: 150, crop: "fill"
        }, async (err, result) => {
            if(err) {
                throw err;
            }

            removeTmp(file.tempFilePath);

            res.json({
                url: result.secure_url
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}