import prisma from "../../prisma/client";

// (Create user) this is for register.ts query
export const createUser = async (username: string, password: string) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
    select: { id: true, username: true }, 
  });
};

// Find user by username (for login.ts and register.ts to check existing user)
export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};
