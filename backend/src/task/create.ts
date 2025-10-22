import { Request, Response } from "express";
import { taskSchema } from "./schema";
import { insertTask } from "./query";

// CREATE Task Handler
export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod schema
    const parsedTask = taskSchema.parse(req.body);

    // TEMP FIX: Hardcode userId = 1 (until authentication is ready)
    // Later, you can replace this with req.user.id once JWT/auth is integrated.
    const userId = 1;

    // Create new task
    const newTask = await insertTask(parsedTask, userId);

    // Respond with created task
    res.status(201).json(newTask);
  } catch (err: any) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.errors || err.message });
  }
};
