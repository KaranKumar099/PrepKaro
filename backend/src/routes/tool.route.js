import { Router } from "express";
import { getRandomQuestions } from "../controllers/ai.controller.js";
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(jwtVerification, getRandomQuestions)

export default router