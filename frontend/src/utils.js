
export function mapTaskToRow(task) {
  const now = new Date();
  const created = new Date(task.createdAt || task.createdAt);
  const deadline = new Date(task.deadline);
  let displayStatus = "";

  if (task.status === "DONE") {
    
    displayStatus = "Achieved";
  } else {
    // TODO
    if (now < deadline) displayStatus = "In Progress";
    else displayStatus = "Failed";
  }

  return {
    id: task._id,
    title: task.title,
    description: task.description,
    deadline: deadline.toISOString().split("T")[0],
    status: displayStatus,
    rawStatus: task.status,
    linkedFile: task.linkedFile,
    createdAt: task.createdAt
  };
}
