import { z } from "zod";

// CREATE task schema
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(), // ✅ replaces completed
});

// UPDATE task schema (all fields optional)
export const updateTaskSchema = taskSchema.partial();

// DELETE task schema
export const deleteTaskSchema = z.object({
  id: z.number(),
});

// TypeScript types
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
