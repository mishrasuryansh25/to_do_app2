import { Request, Response } from "express";
import { updateTaskSchema } from "./schema";
import { updateTask } from "./query";

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // ✅ Get the user ID from JWT-authenticated request
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user info" });
    }

    // ✅ Validate update input
    const validatedData = updateTaskSchema.parse(req.body);

    // ✅ Update only if task belongs to this user
    const updated = await updateTask(id, validatedData, userId);

    if (!updated) {
      return res.status(404).json({ error: "Task not found or not owned by user" });
    }

    res.json({ message: "Task updated successfully", task: updated });
  } catch (err: any) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.errors || err.message });
  }
};
