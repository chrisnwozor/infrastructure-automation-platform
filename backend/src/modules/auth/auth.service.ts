import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { LoginInput, RegisterInput } from "./auth.schema";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const createToken = (userId: string): string =>
  jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const password = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return {
    user,
    token: createToken(user.id),
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token: createToken(user.id),
  };
};
