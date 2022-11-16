const express = require("express");
const { project } = require("../middleware/authenMiddleware");
const {
  sendMessage,
  sendFileMessage,
  getFileMessageAWS,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
} = require("../controller/messageController");

// FILE
const multer = require("multer");
const storage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, "");
  },
});
function checkFileType(file, cb) {
  const fileTypes = /doc|docx|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const minetype = fileTypes.test(file.mimetype);
  if (extname && minetype) {
    return cb(null, true);
  }
  return cb("Error: Doc only");
}
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
// FILE - END
const router = express.Router();
router.route("/").post(project, sendMessage);
router.route("/file").post(project, upload.single("file"), sendFileMessage);
router
  .route("/file/:imageUrl")
  .post(project, upload.fields([]), getFileMessageAWS);
router.route("/recallMessage").post(project, recallMessage);
router.route("/:chatId").get(project, getAllMessages);
router.route("/image/:chatId").get(project, getAllImageMessages);

module.exports = router;
