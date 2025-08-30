const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/tasks.controller");

// setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    // keep original name with timestamp to avoid collisions
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const name = unique + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // accept only pdf
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed"), false);
  }
});

router.post("/tasks", upload.single("file"), controller.createTask);
router.get("/tasks", controller.getTasks);
router.get("/tasks/:id", controller.getTask);
router.put("/tasks/:id", upload.single("file"), controller.updateTask);
router.patch("/tasks/:id/status", controller.updateStatus);
router.delete("/tasks/:id", controller.deleteTask);
router.get("/files/:filename", controller.serveFile);

module.exports = router;
