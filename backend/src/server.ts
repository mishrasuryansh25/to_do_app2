import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import prisma from "./db";
import authRouter from "./auth";   // ✅ import combined auth router
import taskRouter from "./task";   // ✅ import new task router

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Mount routes
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
