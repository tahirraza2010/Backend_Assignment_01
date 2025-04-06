import express from "express";
import mongoose from "mongoose";
import taskModel from "./models/TaskSchema.js";

const app = express();
const PORT = 5000;

// MongoDB Connection URI
const DB_URI =
  "mongodb+srv://tahirrazagb2010:tahir2010@cluster0.zjbgcyq.mongodb.net/";

// Connect MongoDB
mongoose.connect(DB_URI);
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully..");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

// Middleware
app.use(express.json());

// ✅ Get All Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Create Task
app.post("/tasks", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required" });
    }

    const newTask = await taskModel.create({ text });
    res.status(201).json({ message: "Task created successfully", newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Task
app.put("/tasks", async (req, res) => {
  try {
    const { taskId, text } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required" });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { text },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await taskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete All Tasks
app.delete("/tasks", async (req, res) => {
  try {
    await taskModel.deleteMany({});
    res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/',(req,res)=>{
  res.send('Welcome to todo app')
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
