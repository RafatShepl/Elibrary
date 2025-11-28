

const multer = require("multer")
const path = require("path")
//storage

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/Images")

    },
    filename:(req,file,cb)=>{
     const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
    }
})

//filter
  const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // السماح للصور فقط
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

module.exports = upload;