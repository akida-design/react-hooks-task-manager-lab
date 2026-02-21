import React, { useState, useId, useContext } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskForm() {
  const [taskName, setTaskName] = useState("");
  const id = useId();
  const { addTask } = useContext(TaskContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const title = taskName.trim();
    if (title.trim() === "") return;
    try {
      await addTask({ title, completed: false });
      setTaskName("");
    } catch (err) {
      console.error("Failed to add task:", err);
  }
}

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={id}>New Task:</label>
      <input
        id={id}
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;