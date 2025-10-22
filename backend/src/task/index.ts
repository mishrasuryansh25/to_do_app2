import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // ✅ generate unique IDs

const router = Router();
const SECRET = process.env.JWT_SECRET as string;

// Extend Request type
interface AuthenticatedRequest extends Request {
  user?: { username: string; id: string };
}

// Middleware for JWT auth
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

// Example in-memory tasks (replace later with Prisma DB calls)
let tasks: { id: string; username: string; title: string; description: string; status: string }[] = [];

// ✅ GET all tasks for logged-in user
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username;
  if (!username) return res.status(403).json({ message: "Unauthorized" });
  res.json(tasks.filter((t) => t.username === username));
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
    status: status || "pending", // default status
  };

  tasks.push(newTask);
  res.json({ message: "Task added successfully", task: newTask });
});

// ✅ PUT update task (title/description/status)
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

export default router;
