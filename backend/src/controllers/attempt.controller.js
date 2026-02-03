import { Attempt } from "../models/attempt.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/question.model.js";
import { Exam } from "../models/exam.model.js";

// createAttempt (when a user starts an exam)
// saveAnswer
// getAttempt (fetch details of one attempt)
// getAllAttempts (for user dashboard)
// evaluateAttempt (calculate score, time stats)
// submitAttempt

const createAttempt= asyncHandler (async (req, res) => {
    const {examId} = req.body

    const exam = await Exam.findById(examId);
    if (!exam) {
        throw new ApiError(404, "Exam not found");
    }

    const answers = exam.questions.map((q) => ({
        question: q,
        userAnswer: null,
        timeSpent: "0:00",
        status: "unattempted",
        markedForReview: false,
    }));

    const attempt = await Attempt.create({
        user: req.user._id, 
        exam: examId,
        answers,
        startTime: Date.now(),
        status: "in-progress",
        totalMarks: exam.totalMarks,
        score: 0,
    })
    if(!attempt){
        throw new apiError(400, "Error in creating attempt")
    }

    return res.status(200).json(
        new apiResponse(200, attempt, "attempt created successfully")
    )
})

const saveAnswer = asyncHandler(async (req, res) => {
    const {attemptId} = req.params
    const {questionId, userAnswer, markedForReview} = req.body

    const attempt = await Attempt.findById(attemptId)
    if(!attempt){
        throw new apiError(400, "Error in finding attempt of the given attemptId")
    }

    let status;
    const question = await Question.findById(questionId)
    console.log("question answered: ", question)
    console.log("user answer : ", userAnswer)
    
    if(question.answer.charCodeAt(0)-65 === userAnswer){
        status = "correct"
    }else{
        status= "incorrect"
    }

    const existing = attempt.answers.find(item => item.question.toString() === questionId)
    if(existing){
        existing.userAnswer = userAnswer;
        existing.markedForReview = markedForReview ;
        existing.status = status ;
    }else{
        attempt.answers.push({question: questionId, userAnswer, status, markedForReview})
    }
    
    await attempt.save();
    return res.status(200).json(
        new apiResponse(200, attempt, "saved answer successfully")
    )
})

const saveTimeSpent = asyncHandler(async (req, res) => {
    const { attemptId } = req.params;
    const { questionId, timeSpent } = req.body;

    // Update specific answer in answers array
    await Attempt.updateOne(
        {
            _id: attemptId,
            "answers.question": questionId
        },
        {
            $inc: { "answers.$.timespent": timeSpent }
        }
    );

    return res.status(200).json(
        new apiResponse(200, {}, "saved timespent successfully")
    )
});


const getAttempt = asyncHandler( async (req, res) => {
    const {attemptId}= req.params
    const attempt = await Attempt.findById(attemptId).populate("exam").populate("answers.question")
    if(!attempt){
        throw new apiError(400, "Error in fetching attempt")
    }

    return res.status(200).json(
        new apiResponse(200, attempt, "attempt fetched successfully")
    )
})

const submitAttempt = asyncHandler(async (req, res) => {
    const {attemptId} = req.params
    const attempt = await Attempt.findById(attemptId).populate("answers.question")
    if (!attempt) {
        throw apiError(400, "Error in fetching attempt")
    }
    console.log("fetched attempt", attempt)

    let score = 0;
    attempt.answers.forEach((ques) => {
      if (ques.status === "correct"){
        score += ques.question.score;
      }
      else if(ques.status === "incorrect"){
        score -= ques.question.score/4;
      }
    });

    attempt.score = score;
    attempt.endTime = Date.now();
    attempt.status= "submitted";
    await attempt.save(); 

    return res.status(200).json(
        new apiResponse(200, attempt, "attempt submitted successfully")
    )
})

export {createAttempt, saveAnswer, getAttempt, submitAttempt, saveTimeSpent}