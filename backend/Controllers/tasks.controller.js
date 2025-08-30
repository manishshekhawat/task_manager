const path = require("path");
const fs = require("fs");
const Task = require("../models/task.model");

// Create task (formData)
exports.createTask = async (req, res) => {
  try {
    // multer will put file info in req.file
    const { title, description, deadline } = req.body;
    if (!title || !description || !deadline) {
      return res.status(400).json({ message: "title, description, deadline required" });
    }

    let linkedFile;
    if (req.file) {
      linkedFile = req.file.filename; // only filename, served via /files/:filename
    }

    const task = new Task({
      title,
      description,
      deadline: new Date(deadline),
      linkedFile
    });

    await task.save();
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task (formData for optional file)
exports.updateTask = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = new Date(deadline);
    if (status && ["TODO", "DONE"].includes(status)) task.status = status;

    if (req.file) {
      // delete old file if exists
      if (task.linkedFile) {
        const oldPath = path.join(__dirname, "..", "uploads", task.linkedFile);
        fs.unlink(oldPath, (err) => { /* ignore errors */ });
      }
      task.linkedFile = req.file.filename;
    }

    await task.save();
    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change status PATCH
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["TODO", "DONE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Status updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });
    if (task.linkedFile) {
      const filePath = path.join(__dirname, "..", "uploads", task.linkedFile);
      fs.unlink(filePath, (err) => { /* ignore */});
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Serve file by filename
exports.serveFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
};
