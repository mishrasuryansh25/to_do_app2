import { Request, Response } from "express";
import { getTasks } from "./query";

export const fetchTasksHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: missing user info" });
    }

    const tasks = await getTasks(userId);
    res.json(tasks);
  } catch (err: any) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: err.errors || err.message });
  }
};
