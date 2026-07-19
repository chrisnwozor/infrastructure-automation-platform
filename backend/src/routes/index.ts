import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({
    status: "ok",
    version: "v1",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
