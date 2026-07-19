import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { logger } from "../logger/logger";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten(),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  logger.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
