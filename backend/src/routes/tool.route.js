import { Router } from "express";
import { getRandomQuestions, getQuestions } from "../controllers/ai.controller.js";
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(jwtVerification, getQuestions)

export default router