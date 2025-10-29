import prisma from "../../prisma/client";

// (Create user)
export const createUser = async (username: string, password: string) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
    select: { id: true, username: true }, 
  });
};

// Find user by username
export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};
