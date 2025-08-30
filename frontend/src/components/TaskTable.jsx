import * as React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { mapTaskToRow } from "../utils";
import { BASE } from "../api";

export default function TaskTable({ tasks, setTasks, onEdit }) {
  const rows = tasks.map(mapTaskToRow);

  const handleDownload = (row) => {
    if (!row.linkedFile) { alert("No file attached"); return; }
    const fileUrl = `${BASE.replace("/api", "")}/api/files/${row.linkedFile}`;
    // open in new tab to download/view
    window.open(fileUrl, "_blank");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks(prev => prev.filter(t => t._id !== id));
    } else {
      alert("Delete failed");
    }
  };

  const handleMarkDone = async (id) => {
    const res = await fetch(`${BASE}/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DONE" })
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t._id === id ? updated.task : t));
    } else {
      alert("Status update failed");
    }
  };

  const columns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "deadline", headerName: "Deadline", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <DownloadIcon style={{ cursor: "pointer" }} onClick={() => handleDownload(params.row)} />
          <EditIcon style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
          <DeleteIcon style={{ cursor: "pointer" }} onClick={() => handleDelete(params.row.id)} />
          <DoneAllIcon style={{ cursor: "pointer" }} onClick={() => handleMarkDone(params.row.id)} />
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ height: 520, width: "95%", mx: "auto", mt: 2 }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
    </Box>
  );
}
