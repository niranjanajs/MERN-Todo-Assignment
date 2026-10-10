
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET: Display all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// POST: Add a new task
router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title ?? "").trim();

    if (!title) {
      return res.status(400).json({
        message: "Task title cannot be empty",
      });
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to add task" });
  }
});

// PUT: Update a task
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      const title = String(req.body.title ?? "").trim();

      if (!title) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }

      updates.title = title;
    }

    if (req.body.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be true or false",
        });
      }

      updates.completed = req.body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid updates provided",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE: Remove a task
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
