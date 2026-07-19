import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({
    status: "ok",
    version: "v1",
  });
});

router.use("/auth", authRoutes);

export default router;
