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
        throw new apiError(404, "Exam not found");
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
    const { attemptId } = req.params;
    const { questionId, userAnswer, markedForReview } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
        throw new apiError(404, "Attempt not found");
    }

    const question = await Question.findById(questionId);
    if (!question) {
        throw new apiError(404, "Question not found");
    }

    let status = "unattempted";

    // Determine correctness based on question type
    if (userAnswer !== undefined && userAnswer !== null && userAnswer !== "") {
        const type = question.questionType?.toUpperCase();

        if (type === "MCQ") {
            // question.answer is like ["A"], userAnswer is an index (0, 1, 2, 3)
            const correctIdx = question.answer[0].charCodeAt(0) - 65;
            status = (parseInt(userAnswer) === correctIdx) ? "correct" : "incorrect";
        } 
        else if (type === "MSQ") {
            // userAnswer is expected to be an array of indices (e.g., [0, 2]) or a comma-separated string
            const userArr = (Array.isArray(userAnswer) ? userAnswer : userAnswer.toString().split(','))
                .map(val => parseInt(val))
                .filter(val => !isNaN(val))
                .sort((a, b) => a - b);
                
            const correctArr = question.answer
                .map(ans => ans.charCodeAt(0) - 65)
                .sort((a, b) => a - b);

            if (userArr.length === correctArr.length && userArr.every((val, idx) => val === correctArr[idx])) {
                status = "correct";
            } else {
                status = "incorrect";
            }
        } 
        else if (type === "NAT") {
            // Numerical Answer Type: Compare floating point values
            const userVal = parseFloat(userAnswer);
            const correctVal = parseFloat(question.answer[0]);
            status = (!isNaN(userVal) && userVal === correctVal) ? "correct" : "incorrect";
        }
    }

    const existingAnswer = attempt.answers.find(item => item.question.toString() === questionId);
    
    // Format userAnswer for storage (stored as String in schema)
    const storedAnswer = Array.isArray(userAnswer) ? userAnswer.join(',') : (userAnswer !== undefined && userAnswer !== null ? String(userAnswer) : "");

    if (existingAnswer) {
        existingAnswer.userAnswer = storedAnswer;
        existingAnswer.status = status;
        if (markedForReview !== undefined) {
            existingAnswer.markedForReview = markedForReview;
        }
    } else {
        attempt.answers.push({
            question: questionId,
            userAnswer: storedAnswer,
            status,
            markedForReview: markedForReview || false
        });
    }

    await attempt.save();

    return res.status(200).json(
        new apiResponse(200, attempt, "saved answer successfully")
    );
});

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
        throw new apiError(400, "Error in fetching attempt")
    }
    console.log("fetched attempt", attempt)

    let score = 0;
    attempt.answers.forEach((ques) => {
      if (ques.status === "correct") {
        score += ques.question.score;
      }
      else if (ques.status === "incorrect") {
        // Only MCQ questions have negative marking
        if (ques.question.questionType === "MCQ") {
          score -= ques.question.score / 4;
        }
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