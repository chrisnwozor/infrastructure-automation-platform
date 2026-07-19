import type { Request, Response } from "express";

import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { body } = registerSchema.parse({ body: req.body });
  const result = await registerUser(body);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const login = async (req: Request, res: Response) => {
  const { body } = loginSchema.parse({ body: req.body });
  const result = await loginUser(body);

  res.status(200).json({
    success: true,
    data: result,
  });
};
