import { Router, Request, Response } from "express";

const router = Router();

router.post("/", (_req: Request, res: Response) => {
  res.json({ message: "User logged out (delete token on client side)" });
});

export default router;
