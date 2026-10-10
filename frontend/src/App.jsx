
import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks when the page loads
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (err) {
        setError("Could not load tasks. Check the backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // Add a new task
  async function addTask(title) {
    try {
      const response = await axios.post(API_URL, { title });
      setTasks((previous) => [response.data, ...previous]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
      throw err;
    }
  }

  // Mark a task complete or incomplete
  async function toggleTask(task) {
    try {
      const response = await axios.put(`${API_URL}/${task._id}`, {
        completed: !task.completed,
      });

      setTasks((previous) =>
        previous.map((item) =>
          item._id === task._id ? response.data : item
        )
      );
      setError("");
    } catch (err) {
      setError("Failed to update task");
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setTasks((previous) =>
        previous.filter((task) => task._id !== id)
      );
      setError("");
    } catch (err) {
      setError("Failed to delete task");
    }
  }

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">Organize your day, one task at a time.</p>

        <TaskForm onAddTask={addTask} />

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}

        <p className="footer">Tasks are saved in MongoDB.</p>
      </div>
    </div>
  );
}

export default App;
