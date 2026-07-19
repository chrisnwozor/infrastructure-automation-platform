import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { create, getOne, list, remove, update } from "./project.controller";

const router = Router();

router.use(authenticate);

router.post("/", asyncHandler(create));
router.get("/", asyncHandler(list));
router.get("/:projectId", asyncHandler(getOne));
router.patch("/:projectId", asyncHandler(update));
router.delete("/:projectId", asyncHandler(remove));

export default router;
