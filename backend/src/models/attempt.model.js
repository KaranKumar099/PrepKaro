import mongoose, {Schema} from "mongoose";

// const answerSchema = new mongoose.Schema({
//   id: Number,
//   question: String,
//   options: [String],
//   correctAnswer: Number,
//   userAnswer: { type: Number, default: null },
//   status: { type: String, default: "unattempted" },
//   marks: Number,
//   timeSpent: { type: String, default: "0:00" },
//   difficulty: String,
//   markedForReview: {
//     type: Boolean,
//     default: false
//   }
// });

const attemptSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    exam: {
        type: mongoose.Types.ObjectId,
        ref: "Exam"
    },
    answers: [{
        question: {
            type: mongoose.Types.ObjectId,
            ref: "Question"
        },
        userAnswer: {
            type: String
        },
        timespent: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["correct", "incorrect", "unattempted"],
            default: "unattempted"
        },
        markedForReview: {
            type: Boolean,
            default: false
        }
    }],
    score: {
        type: Number,
        required: true
    },
    startTime: Date,
    endTime: Date,
    status: {
        type: String,
        enum: ["in-progress", "submitted"],
        default: "in-progress"
    }
},{timestamps: true})

export const Attempt= mongoose.model("Attempt", attemptSchema)