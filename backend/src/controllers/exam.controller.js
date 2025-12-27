import { Attempt } from "../models/attempt.model.js";
import { Exam } from "../models/exam.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// createExam
// getAllExam
// getExamById
// updateExam
// deleteExam

const createExam = asyncHandler (async (req, res) => {
    console.log("=== CREATE EXAM CALLED ===");
    console.log("Request body size:", JSON.stringify(req.body).length, "characters");
    console.log("Number of questions:", req.body.questions?.length);
    const {title, questions, difficulty, duration , totalMarks} = req.body
    if(!questions){
        throw new apiError(400, "Questions not recieved")
    }

    const exam = await Exam.create({
        title,
        questions,
        difficulty,
        duration,
        totalMarks,
        createdBy: req.user._id
    })
    if(!exam){
        throw new apiError(400, "Error in creating Exam")
    }

    return res.status(200).json(
        new apiResponse(200, exam, "Exam created successfully")
    )
})

const getAllExams = asyncHandler (async (req, res) => {
    const allExams = await Exam.find({createdBy: req.user._id})
    if (allExams.length === 0) {
        return res.status(200).json(
            new apiResponse(200, [], "No exams found for this user.")
        );
    }

    let history = [];
    for (const exam of allExams) {
        const attempts = await Attempt.find({ exam: exam._id }).populate("exam");
        if (attempts.length > 0) {
            history.push(...attempts);
        }else{
            history.push(exam);
        }
    }

    return res.status(200).json(
        new apiResponse(200, history, "All exams of user fetched successfully")
    )
})

const getExamById = asyncHandler (async (req, res) => {
    const {examId} = req.params
    const exam = await Exam.findById(examId).populate("questions")
    if(!exam){
        throw new apiError(400, "Error in fetching exam")
    }

    return res.json(
        new apiResponse(200, exam, "Exam successfully fetched")
    )
})

// for admin / teacher
const updateExam = asyncHandler (async (req, res) => {
    
})
const deleteExam = asyncHandler (async (req, res) => {
    
})

export {createExam, getAllExams, getExamById, }