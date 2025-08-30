const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const tasksRoutes = require("./routes/tasks.routes");

const app = express();

app.use(cors());
app.use(express.json()); // for JSON bodies

// expose uploads folder statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api", tasksRoutes);

// connect to mongodb (change if needed)
const MONGO_URL = process.env.MONGO_URL ;

mongoose.connect(MONGO_URL, {
  // mongoose 7+ doesn't need useNewUrlParser flags but it's ok
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((e) => {
  console.error("MongoDB connection error", e);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
