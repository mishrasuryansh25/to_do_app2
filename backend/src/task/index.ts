// src/routes/index.ts
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { createTaskHandler } from "./create";
import { fetchTasksHandler } from "./fetch";
import { updateTaskHandler } from "./update";
import { deleteTaskHandler } from "./delete";

const router = Router();
const SECRET = process.env.JWT_SECRET as string || "default_secret_for_dev";

// Extend Request with user info added by JWT middleware
interface AuthenticatedRequest extends Request {
  user?: { username: string; id: number };
}

// JWT auth middleware
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Ensure payload shape matches your token creation
    // e.g. jwt.sign({ username, id }, SECRET)
    req.user = payload as { username: string; id: number };
    next();
  });
}

// Routes — delegate to modular handlers
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  fetchTasksHandler(req, res).catch(next)
);

router.post("/", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  createTaskHandler(req, res).catch(next)
);

// Update uses updateTaskHandler (which expects req.user to exist and calls query.updateTask(id, data, userId))
router.put("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  updateTaskHandler(req, res).catch(next)
);

// Delete uses deleteTaskHandler (which expects req.user to exist and calls query.deleteTask(id, userId))
router.delete("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  deleteTaskHandler(req, res).catch(next)
);

export default router;
