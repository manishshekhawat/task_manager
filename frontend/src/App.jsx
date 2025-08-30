import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TaskTable from "./components/TaskTable";
import { AddTask } from "./components/AddTask";
import { BASE } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaved = () => {
    // refresh
    fetchTasks();
  };

  const handleEdit = (row) => {
    // fetch full task object
    const t = tasks.find(t => t._id === row.id);
    setEditTask({ id: row.id, ...t });
    setOpen(true);
  };

  return (
    <>
      <AddTask
        open={open}
        handleClose={() => { setOpen(false); setEditTask(null); }}
        onSaved={handleSaved}
        taskToEdit={editTask}
      />

      <Box sx={{ backgroundColor: blue[700], color: "white", p: 2, fontSize: 20 }}>
        Task Manager
      </Box>

      <TaskTable tasks={tasks} setTasks={setTasks} onEdit={(row) => handleEdit(row)} />

      <Box sx={{ textAlign: "right", m: 5, cursor: "pointer", color: blue[700] }} onClick={() => setOpen(true)}>
        <AddCircleIcon style={{ fontSize: 35, cursor: "pointer" }} />
      </Box>
    </>
  );
}

export default App;
