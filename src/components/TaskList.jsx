import React, { useContext,useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskList({query = "" }) {
    const { tasks, toggleComplete } = useContext(TaskContext);
    const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(query.toLowerCase())
  );
  console.log("tasks from ctx:", tasks);

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.title}
          </span>
          <button data-testid={task.id} onClick={() => toggleComplete(task.id)}>
            {task.completed ? "Undo" : "Complete"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
