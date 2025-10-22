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
export const updateTask = async (id: number, task: UpdateTaskInput) => {
  return await prisma.task.update({
    where: { id },
    data: {
      title: task.title,
      description: task.description,
      status: task.status,
    },
  });
};

// DELETE task
export const deleteTask = async (id: number) => {
  return await prisma.task.delete({
    where: { id },
  });
};
