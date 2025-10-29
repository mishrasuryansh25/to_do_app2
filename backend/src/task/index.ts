// src/routes/index.ts
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { createTaskHandler } from "./create";
import { fetchTasksHandler } from "./fetch";
import { updateTaskHandler } from "./update";
import { deleteTaskHandler } from "./delete";

const router = Router();
const SECRET = process.env.JWT_SECRET as string || "default_secret_for_dev";

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

    
    req.user = payload as { username: string; id: number };
    next();
  });
}

router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  fetchTasksHandler(req, res).catch(next)
);

router.post("/", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  createTaskHandler(req, res).catch(next)
);

router.put("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  updateTaskHandler(req, res).catch(next)
);

router.delete("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
  deleteTaskHandler(req, res).catch(next)
);

export default router;
