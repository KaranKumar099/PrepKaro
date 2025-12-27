import { Router } from "express";
import {createAttempt, getAttempt, saveAnswer, saveTimeSpent, submitAttempt} from "../controllers/attempt.controller.js"
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(jwtVerification, createAttempt)
router.route("/:attemptId/submit").post(jwtVerification, submitAttempt)
router.route("/:attemptId/answer").post(jwtVerification, saveAnswer)
router.route("/:attemptId").get(jwtVerification, getAttempt)
router.route("/:attemptId/timespent").post(jwtVerification, saveTimeSpent)

export default router