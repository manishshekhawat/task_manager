import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField
} from "@mui/material";
import { BASE } from "../api";

export function AddTask({ open, handleClose, onSaved, taskToEdit }) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    deadline: "",
    file: null,
    status: ""
  });

  React.useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        deadline: taskToEdit.deadline ? taskToEdit.deadline.split("T")[0] : "",
        file: null,
        status: taskToEdit.rawStatus || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        deadline: "",
        file: null,
        status: ""
      });
    }
  }, [taskToEdit, open]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSave = async () => {
    try {
      // validate
      if (!formData.title || !formData.description || !formData.deadline) {
        alert("Please fill title, description, deadline");
        return;
      }

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("deadline", formData.deadline);
      if (formData.file) fd.append("file", formData.file);

      const url = taskToEdit ? `${BASE}/tasks/${taskToEdit.id}` : `${BASE}/tasks`;
      const method = taskToEdit ? "PUT" : "POST";

      const resp = await fetch(url, {
        method,
        body: fd
      });

      if (!resp.ok) {
        const err = await resp.json();
        console.error(err);
        alert("Error saving task");
        return;
      }
      const resJson = await resp.json();
      onSaved(resJson.task || resJson.task); // parent will refresh
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error saving task");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <TextField
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          type="date"
          label="Deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
