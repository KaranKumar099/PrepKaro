import mongoose, { Schema } from "mongoose";

const questionModel = new Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  picture: String,
  options: {
    type: [String],
    default: [],
  },
  answer: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true
  },
  questionType: {
    type: String,
    enum: ["MCQ", "MSQ", "NAT"],
    required: true,
  },
  exam: {
    category: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  chapter: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficultyLvl: {
    type: String,
  },
});

export const Question = mongoose.model("Question", questionModel);
