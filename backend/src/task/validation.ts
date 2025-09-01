import { Response, Request } from "express";
import { z } from "zod";
export const updateTaskSchema = z.object({
    id: z.string().regex(/^\d+$/, "Task ID must be a number"),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
});

export const deleteTaskSchema = z.object({
    id: z.string().regex(/^\d+$/, "Task ID must be a number")
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput= z.infer<typeof deleteTaskSchema>;