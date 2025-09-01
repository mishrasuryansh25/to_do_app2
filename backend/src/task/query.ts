import prisma from "../../prisma/client";
import { TaskInput, UpdateTaskInput } from "./schema";

// CREATE task
export const insertTask = async (task: TaskInput) => {
  return await prisma.task.create({
    data: task,
  });
};

// READ task 
export const getTasks = async () => {
  return await prisma.task.findMany();
};

// UPDATE tasks
export const updateTask = async (id: number, task: UpdateTaskInput) => {
  return await prisma.task.update({
    where: { id },
    data: task,
  });
};

// DELETE tasks
export const deleteTask = async (id: number) => {
  return await prisma.task.delete({
    where: { id },
  });
};
