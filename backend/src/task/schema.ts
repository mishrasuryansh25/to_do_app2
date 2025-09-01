import { z } from "zod"

export const taskSchema = z.object({
    title: z.string().min(1,"Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
});

export const updateTaskSchema = taskSchema.partial();
export const deleteTaskSchema = z.object({
    id: z.number(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;