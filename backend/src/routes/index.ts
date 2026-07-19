import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import projectRoutes from "../modules/project/project.routes";
import userRoutes from "../modules/user/user.routes";
import resourceRoutes from "../modules/resource/resource.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({
    status: "ok",
    version: "v1",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use(resourceRoutes);

export default router;
