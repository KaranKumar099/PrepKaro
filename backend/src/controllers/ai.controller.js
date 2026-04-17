import {asyncHandler} from "../utils/asyncHandler.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Question} from "../models/question.model.js"

const getQuestions = asyncHandler(async (req, res) => {
  const { exam, difficulty, questionCount } = req.body
  console.log(exam, difficulty, questionCount);
  const temp = exam.split(" ")
  const examCategory = temp[0]
  const examBranch = temp.slice(1).join(" ")
  
  const usedIds = [];

  /**
   * Helper to fetch specific questions while ensuring variety and avoiding duplicates
   */
  async function fetchQuestions(type, marks, count, branch, chapter, except) {
    if (count <= 0) return [];
    
    // Dynamically build match criteria
    const matchCriteria = {
      "exam.category": examCategory,
      "exam.branch": branch,
      questionType: type,
      score: marks,
      _id: { $nin: usedIds }
    };

    if (chapter) {
      matchCriteria.chapter = chapter;
    }
    
    if (except) {
      // If chapter already exists in matchCriteria (from if(chapter)), 
      // we ensure it's also NOT 'except' (though usually they wouldn't both be provided)
      if (matchCriteria.chapter) {
        if (typeof matchCriteria.chapter === 'string') {
          if (matchCriteria.chapter === except) {
             // Logic error in call: wanting chapter X but not chapter X. 
             // Result will be empty.
             matchCriteria.chapter = { $eq: matchCriteria.chapter, $ne: except };
          }
        }
      } else {
        matchCriteria.chapter = { $ne: except };
      }
    }

    const pipeline = [
      { $match: matchCriteria },
      // To ensure diversity, we can group by chapter or topic if needed
      // but simple sample is often sufficient for randomness
      { $sample: { size: count } }
    ];

    const result = await Question.aggregate(pipeline);
    result.forEach(q => usedIds.push(q._id));
    return result;
  }

  // 1. General Aptitude (GA) - Questions 1 to 10
  const ga1Marks = await fetchQuestions("MCQ", 1, 5, examBranch, "General Aptitude");
  const ga2Marks = await fetchQuestions("MCQ", 2, 5, examBranch, "General Aptitude");

  // 2. CS Subjects - Questions 11 to 35 (1 Mark each)
  const cs1MarkMCQ = await fetchQuestions("MCQ", 1, 10, examBranch, null, "General Aptitude"); // Q11-20
  const cs1MarkMSQ = await fetchQuestions("MSQ", 1, 8, examBranch); // Q21-28
  const cs1MarkNAT = await fetchQuestions("NAT", 1, 7, examBranch);  // Q29-35

  // 3. CS Subjects - Questions 36 to 65 (2 Marks each)
  const cs2MarkMCQ = await fetchQuestions("MCQ", 2, 10, examBranch, null, "General Aptitude"); // Q36-45
  const cs2MarkMSQ = await fetchQuestions("MSQ", 2, 7, examBranch);  // Q46-52
  const cs2MarkNAT = await fetchQuestions("NAT", 2, 13, examBranch); // Q53-65

  // Combine in exact order
  const questionsArr = [
    ...ga1Marks,
    ...ga2Marks,
    ...cs1MarkMCQ,
    ...cs1MarkMSQ,
    ...cs1MarkNAT,
    ...cs2MarkMCQ,
    ...cs2MarkMSQ,
    ...cs2MarkNAT
  ];

  // console.log(`Fetched ${questionsArr.length} questions for ${examCategory} ${examBranch}`);

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