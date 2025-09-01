// src/auth/index.ts
import { Router } from "express";
import loginRouter from "./login";
import logoutRouter from "./logout";
import registerRouter from "./register";

const router = Router();

// mount each one
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/register", registerRouter);

export default router;
