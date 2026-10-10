
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task-item">
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />

        <span className={task.completed ? "completed" : ""}>
          {task.title}
        </span>
      </label>

      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(task._id)}
      >
        Delete
      </button>
    </li>
  );
}
