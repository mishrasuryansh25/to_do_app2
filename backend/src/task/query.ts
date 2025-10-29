import prisma from "../../prisma/client";
import { TaskInput, UpdateTaskInput } from "./schema";

// CREATE task
export const insertTask = async (task: TaskInput, userId: number) => {
  return await prisma.task.create({
    data: {
      title: task.title,
      description: task.description,
      status: task.status || "pending",
      user: {
        connect: { id: userId },
      },
    },
  });
};

// READ tasks
export const getTasks = async (userId?: number) => {
  return await prisma.task.findMany({
    where: userId ? { userId } : {},
  });
};

// UPDATE task
export const updateTask = async (id: number, task: UpdateTaskInput, userId: number) => {
  
  const updated = await prisma.task.updateMany({
    where: { id, userId }, 
    data: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });

  if (updated.count === 0) return null;

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

