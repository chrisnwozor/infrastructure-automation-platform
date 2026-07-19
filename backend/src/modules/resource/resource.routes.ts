import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { create, getOne, list, remove, update } from "./resource.controller";

const router = Router();

router.use(authenticate);

router.post("/projects/:projectId/resources", asyncHandler(create));
router.get("/projects/:projectId/resources", asyncHandler(list));

router.get("/resources/:resourceId", asyncHandler(getOne));
router.patch("/resources/:resourceId", asyncHandler(update));
router.delete("/resources/:resourceId", asyncHandler(remove));

export default router;
