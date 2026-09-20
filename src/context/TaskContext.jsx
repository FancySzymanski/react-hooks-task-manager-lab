import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

const API_URL = "http://localhost:6001/tasks";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error("failed to get tasks");
        return r.json();
      })
      .then(setTasks)
      .catch((err) => console.log(err.message));
  }, []);

  function addTask(title) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("failed to add task");
        return r.json();
      })
      .then((newTask) => setTasks((prev) => [...prev, newTask]))
      .catch((err) => console.log(err.message));
  }

  function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("failed to update task");
        return r.json();
      })
      .then((updated) =>
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      )
      .catch((err) => console.log(err.message));
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
}