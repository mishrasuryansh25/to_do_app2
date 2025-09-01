import { Request, Response } from "express";
import { updateTaskSchema } from "./schema";
import { updateTask } from "./query";

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // Validate input using Zod
    const validatedData = updateTaskSchema.parse(req.body);

    const updated = await updateTask(id, validatedData);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
