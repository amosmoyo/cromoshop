const fs = require("fs");

exports.avatarUploadMiddleware = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const file = req.files.file;

    if (file.size > 2048 * 2048) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ msg: "Size too large." });
      } // 1mb
  
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && ile.mimetype !== "image/jpg") {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ msg: "File format is incorrect." });
      }

      next()
  } catch (error) {
    return res.status(500).json({
        message: error.message,
    });
  }
};


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}