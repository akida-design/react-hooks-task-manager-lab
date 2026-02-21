import React, { useEffect, useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./TaskForm";
import SearchBar from "./SearchBar";

function App() {
  const { tasks, setTasks } = useContext(TaskContext);

  useEffect(() => {
    // load tasks if context is empty
    if (!tasks || tasks.length === 0) {
      fetch('http://localhost:6001/tasks')
      .then(r=>r.json())
      .then(data=>setTasks(data))
      .catch((e) => console.error(e));
    }
  }, [tasks, setTasks]);

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm />
      <SearchBar />
    </div>
  );
}

export default App;
