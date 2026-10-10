
import { useState } from "react";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await onAddTask(title);
      setTitle("");
    } catch {
      // Keep the entered title if adding fails.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter a new task"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <button type="submit">Add Task</button>
    </form>
  );
}
