import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { me } from "./user.controller";

const router = Router();

router.get("/me", authenticate, asyncHandler(me));

export default router;
