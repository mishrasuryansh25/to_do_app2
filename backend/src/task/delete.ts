import { Request, Response } from "express";
import { deleteTask } from "./query";

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // ✅ Get userId from JWT middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user info" });
    }

    // ✅ Delete only if task belongs to user
    const deleted = await deleteTask(id, userId);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found or not owned by user" });
    }

    res.json({ message: "Task deleted successfully", task: deleted });
  } catch (err: any) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.errors || err.message });
  }
};
