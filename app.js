import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskModel from "./models/TaskSchema.js";

const app = express();
const PORT = 5000;

// Connect to MongoDB Atlas with database name
mongoose
  .connect("mongodb+srv://tahirrazagb2010:tahir2010@cluster0.zjbgcyq.mongodb.net/todoDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// 🟢 Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// 🟢 Create Task
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Task text is required" });

  try {
    const newTask = await taskModel.create({ text });
    res.status(201).json({ newTask });
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// 🟢 Update Task
app.put("/tasks", async (req, res) => {
  const { taskId, text } = req.body;
  if (!taskId || !text?.trim()) {
    return res.status(400).json({ message: "Task ID and text are required" });
  }

  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { text },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// 🟢 Delete One Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await taskModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

// 🟢 Delete All Tasks
app.delete("/tasks", async (req, res) => {
  try {
    await taskModel.deleteMany({});
    res.status(200).json({ message: "All tasks deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting all tasks" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
