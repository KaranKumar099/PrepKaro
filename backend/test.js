import { Question } from "./src/models/question.model.js";
import mongoose from "mongoose";

async function getRandomQuestions(exam, difficultyLevel) {
  // Difficulty distribution rules
  const distribution = {
    easy: { easy: 0.2, medium: 0.75, hard: 0.05 },
    medium: { easy: 0.1, medium: 0.8, hard: 0.1 },
    hard: { easy: 0.05, medium: 0.75, hard: 0.2 },
    "very hard": { easy: 0, medium: 0.7, hard: 0.3 }
  };

  const dist = distribution[difficultyLevel.toLowerCase()];
  for(const item in dist){
    console.log(`${item}: ${dist[item]}`)
  }
  if (!dist) throw new Error("Invalid difficulty level");

  const totalQuestions = 10;
  const temp = exam.split(" ")
  const examCategory = temp[0]
  const examBranch = temp.slice(1).join(" ")
  console.log(`examCategory : ${examCategory}, examBranch : ${examBranch}`)

  // Compute number of questions per difficulty
  const numQuestions = {
    easy: Math.round(dist.easy * totalQuestions),
    medium: Math.round(dist.medium * totalQuestions),
    hard: Math.round(dist.hard * totalQuestions)
  };
  console.log("No of quewtions::")
  for(const item in numQuestions){
    console.log(`${item}: ${numQuestions[item]}`)
  }

  // Helper to fetch random questions per difficulty
  const fetchQuestions = async (diff, limit) => {
    if (limit <= 0) return [];

    // Aggregate pipeline to:
    // 1. Match exam category and difficulty
    // 2. Randomly sample
    // 3. Group by chapter+topic to maximize diversity

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
  const easyQs = await fetchQuestions("easy", numQuestions.easy);
  const mediumQs = await fetchQuestions("medium", numQuestions.medium);
  const hardQs = await fetchQuestions("hard", numQuestions.hard);

  // Combine and shuffle
  let combined = [...easyQs, ...mediumQs, ...hardQs];
  console.log("Questions: ", combined)

  // If total < 50 (due to lack of questions), fill from examCategory
  if (combined.length < totalQuestions) {
    const remaining = totalQuestions - combined.length;
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

  // Shuffle final array
  combined.sort(() => Math.random() - 0.5);

  return combined;
}

// Example usage:
(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/PrepKaro");

  const questions = await getRandomQuestions("GATE Mathematics (MA)", "Medium");
  console.log(JSON.stringify(questions, null, 2));

  await mongoose.disconnect();
})();
