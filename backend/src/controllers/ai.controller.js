import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Question} from "../models/question.model.js"

const getQuestions = asyncHandler(async (req, res) => {
  const {exam, difficulty, questionCount}=req.body
  console.log(questionCount)

  const temp = exam.split(" ")
  const examCategory = temp[0]
  const examBranch = temp.slice(1).join(" ")
  console.log(`examCategory : ${examCategory}, examBranch : ${examBranch}`)

  async function fetch(type, marks, count) {
    const pipeline = [
        {
          $match: {
            "exam.category": examCategory,
            "exam.branch": examBranch,
            questionType: type,
            score: marks
          }
        },
        { $sample: { size: count } }
      ]
    return await Question.aggregate(pipeline);
  }

  const questionsArr = [
    ...(await fetch("MCQ", 1, 5)),
    ...(await fetch("MCQ", 2, 5)),

    ...(await fetch("MCQ", 1, 11)),
    ...(await fetch("MSQ", 1, 10)),
    ...(await fetch("NAT", 1, 4)),

    ...(await fetch("MCQ", 2, 8)),
    ...(await fetch("MSQ", 2, 10)),
    ...(await fetch("NAT", 2, 12))
  ];

  return res.status(200).json(
    new apiResponse(200, questionsArr, "successfully fetched questions from database")
  )
})

const getRandomQuestions = asyncHandler(async (req, res) => {
  const {exam, difficulty, questionCount}=req.body
  console.log(questionCount)

  // Difficulty distribution rules
  const distribution = {
    easy: { easy: 0.25, medium: 0.6, hard: 0.15 },
    medium: { easy: 0.15, medium: 0.7, hard: 0.15 },
    hard: { easy: 0.1, medium: 0.7, hard: 0.2 },
    "very hard": { easy: 0, medium: 0.7, hard: 0.3 }
  };

  const dist = distribution[difficulty.toLowerCase()];
  if (!dist) throw new Error("Invalid difficulty level");

  const temp = exam.split(" ")
  const examCategory = temp[0]
  const examBranch = temp.slice(1).join(" ")
  console.log(`examCategory : ${examCategory}, examBranch : ${examBranch}`)

  // Compute number of questions per difficulty
  const numQuestions = {
    easy: Math.floor(dist.easy * questionCount),
    medium: Math.floor(dist.medium * questionCount),
    hard: Math.floor(dist.hard * questionCount)
  };
  console.log(numQuestions)

  // Helper to fetch random questions per difficulty
  const fetchQuestions = async (diff, limit) => {
    if (limit <= 0) return [];

    const pipeline = [
      { 
        $match: { 
          "exam.category": examCategory,
          "exam.branch": examBranch,
          difficultyLvl: diff, 
        }
      },
      {
        $group: {
          _id: { chapter: "$chapter", topic: "$topic" },
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sample: { size: limit } }
    ];

    return Question.aggregate(pipeline);
  };

  // Fetch questions per difficulty
  const easyQs = await fetchQuestions("Easy", numQuestions.easy);
  const mediumQs = await fetchQuestions("Medium", numQuestions.medium);
  const hardQs = await fetchQuestions("Hard", numQuestions.hard);

  // Combine and shuffle
  let combined = [...easyQs, ...mediumQs, ...hardQs];

  // If total < 50 (due to lack of questions), fill from examCategory
  if (combined.length < questionCount) {
    const remaining = questionCount - combined.length;
    const excludeIds = combined.map(q => q._id);
    const extraQs = await Question.aggregate([
      { 
        $match: {
          "exam.category": examCategory,
          "exam.branch": examBranch, 
          _id: { $nin: excludeIds } 
        } 
      },
      { $sample: { size: remaining } }
    ]);
    combined = combined.concat(extraQs);
  }

  // console.log("combined: ", combined)
  // Shuffle final array
  combined.sort(() => Math.random() - 0.5);

  return res.status(200).json(
    new apiResponse(200, combined, "successfully fetched questions from database")
  )
})

export { getRandomQuestions, getQuestions}