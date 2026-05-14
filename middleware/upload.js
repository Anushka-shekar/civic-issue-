// middleware/upload.js
//const multer = require("multer");

//const storage = multer.diskStorage({
  //destination: "uploads/",
  //filename: (req, file, cb) => {
    //cb(null, Date.now() + "-" + file.originalname);
  //}
//});
//module.exports = multer({ storage });
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG images allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;