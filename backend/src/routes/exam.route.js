import { Router } from "express";
import express from "express";
import {createExam, getExamById, getAllExams} from "../controllers/exam.controller.js"
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(express.json({ limit: '50mb' }),jwtVerification, createExam)
router.route("/").get(jwtVerification, getAllExams)
router.route("/:examId").post(jwtVerification, getExamById)

export default router