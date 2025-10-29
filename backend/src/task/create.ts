import { Request, Response } from "express";
import { taskSchema } from "./schema";
import { insertTask } from "./query";

// CREATE Task Handler
export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedTask = taskSchema.parse(req.body);

    const userId = (req as any).user?.id || 1; // fallback to 1 if not available yet

    const newTask = await insertTask(parsedTask, userId);

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (err: any) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.errors || err.message });
  }
};
