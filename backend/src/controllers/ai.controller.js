import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Question} from "../models/question.model.js"

const getRandomQuestions = asyncHandler(async (req, res) => {
  const {exam, difficulty, questionCount}=req.body

  // Difficulty distribution rules
  const distribution = {
    easy: { easy: 0.2, medium: 0.75, hard: 0.05 },
    medium: { easy: 0.1, medium: 0.8, hard: 0.1 },
    hard: { easy: 0.05, medium: 0.75, hard: 0.2 },
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
    easy: Math.round(dist.easy * questionCount),
    medium: Math.round(dist.medium * questionCount),
    hard: Math.round(dist.hard * questionCount)
  };

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

  console.log("combined: ", combined)
  // Shuffle final array
  combined.sort(() => Math.random() - 0.5);

  return res.status(200).json(
    new apiResponse(200, combined, "successfully fetched questions from database")
  )
})

export { getRandomQuestions}