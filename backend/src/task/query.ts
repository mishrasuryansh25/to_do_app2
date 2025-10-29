import prisma from "../../prisma/client";
import { TaskInput, UpdateTaskInput } from "./schema";

// CREATE task
export const insertTask = async (task: TaskInput, userId: number) => {
  return await prisma.task.create({
    data: {
      title: task.title,
      description: task.description,
      status: task.status || "pending", // default value
      user: {
        connect: { id: userId }, // link to the logged-in user
      },
    },
  });
};

// READ tasks (optional: filter by user)
export const getTasks = async (userId?: number) => {
  return await prisma.task.findMany({
    where: userId ? { userId } : {},
  });
};

// UPDATE task
export const updateTask = async (id: number, task: UpdateTaskInput, userId: number) => {
  // Use updateMany instead of update — updateMany returns count and won't throw if not found
  const updated = await prisma.task.updateMany({
    where: { id, userId }, // ✅ ensures the user owns this task
    data: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });

  // If nothing was updated, return null
  if (updated.count === 0) return null;

  // Fetch and return the updated task
  return prisma.task.findUnique({ where: { id } });
};

// DELETE task
export const deleteTask = async (id: number, userId: number) => {
  const deleted = await prisma.task.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) return null;

  return { id };
};

