import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // ✅ generate unique IDs

const router = Router();
const SECRET = process.env.JWT_SECRET || "default_secret"; // fallback

// Extend Request type
interface AuthenticatedRequest extends Request {
  user?: { username: string; id: string };
}

// ✅ Middleware for JWT auth
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user as { username: string; id: string };
    next();
  });
}

// ✅ Temporary in-memory task store
let tasks: { id: string; username: string; title: string; description: string; status: string }[] = [];

// ✅ GET all tasks + stats for logged-in user
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });

  const userTasks = tasks.filter((t) => t.username === username);

  // ✅ Calculate stats
  const stats = {
    total: userTasks.length,
    completed: userTasks.filter((t) => t.status === "completed").length,
    pending: userTasks.filter((t) => t.status === "pending").length,
    inProgress: userTasks.filter((t) => t.status === "in-progress").length,
  };

  res.json({ tasks: userTasks, stats });
});

// ✅ POST add new task
router.post("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });

  const { title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  const newTask = {
    id: uuidv4(),
    username,
    title,
    description,
    status: status || "pending", // default
  };

  tasks.push(newTask);
  res.json({ message: "Task added successfully", task: newTask });
});

// ✅ PUT update task
router.put("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });

  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = tasks.find((t) => t.id === id && t.username === username);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;

  res.json({ message: "Task updated successfully", task });
});

// ✅ DELETE task
router.delete("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });

  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id && t.username === username);
  if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully", task: deletedTask[0] });
});

export default router;
