import React, { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // load tasks from localStorage on initial render
    useEffect(() => {
        let mounted = true;
        async function fetchTasks() {
            try {
                const res = await fetch("http://localhost:6001/tasks");
                if (!res.ok) throw new Error("Failed to fetch tasks");
                const data = await res.json();
                if (mounted) setTasks(data);
            } catch (e) {
                console.error(e);  
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchTasks();
        return () => { mounted = false; };
    }, []);

    // Toggle task complete
    async function toggleComplete(id) {
        try {
            const existing = tasks.find(t => t.id === id);
            if (!existing) return;
            const updated = { ...existing, completed: !existing.completed };
            // debugging log
            const targetId = encodeURIComponent(String(existing.id));
            console.log("PATCH URL:", `http://localhost:6001/tasks/${targetId}`, "body:", { completed: updated.completed });

            // backend patch
            const res = await fetch(`http://localhost:6001/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: updated.completed })
            });
            if (!res.ok) throw new Error("Failed to update task");

            // update local state
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (e) {
            console.error("toggleComplete error:", e);
        }
        // debugging logs
        console.log("toggleComplete called with id:", id);
        console.log("tasks in context after toggle:", tasks);
    }

    // add new task
    async function addTask(task) {
        try {
            const res = await fetch("http://localhost:6001/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            });
            if (!res.ok) throw new Error("Failed to add task");
            const created = await res.json();
            setTasks((prev) => [...prev, created]);
            return created;
        } catch (e) {
            console.error("addTask error:", e);
            throw e;
        }
    }
    const value = {
        tasks,
        setTasks,
        loading,
        toggleComplete,
        addTask
    };

    return (
        <>
            <TaskContext.Provider value={value}>
                {children}
            </TaskContext.Provider>
        </>
    )
}
