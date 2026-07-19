import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";
import { getCurrentUser } from "./user.service";

export const me = async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new AppError(401, "Authentication required");
  }

  const user = await getCurrentUser(req.userId);

  res.status(200).json({
    success: true,
    data: user,
  });
};
