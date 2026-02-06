import fs from "fs";
// import path from "path";
import axios from "axios";
import {PDFParse} from "pdf-parse";         // for text extraction
// import * as pdfjsLib from "pdfjs-dist"; // for image extraction (with custom logic)

import dotenv from "dotenv";
dotenv.config({path: 'backend/.env'});

const TOKEN = process.env.OPENAI_API_KEY;
const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1";

// Extract text + images
// async function extractPdfContent(questionPdfPath, answerPdfPath="", syllabusPdfPath) {
//   // fs.mkdirSync(imageDir, { recursive: true });

//   // const questionDataBuffer = fs.readFileSync(questionPdfPath);
//   const questionPdfData = new PDFParse(questionPdfPath);
//   const questionText = await questionPdfData.getText();
//   questionText = questionText.text;

//   let answerText; 
//   if(answerPdfPath != ""){
//     // const answerDataBuffer = fs.readFileSync(answerPdfPath);
//     const answerPdfData = new PDFParse(answerPdfPath);
//     answerText = await answerPdfData.getText();
//     answerText = answerText.text;
//   }else{
//     answerText = "";
//   }

//   // const syllabusDataBuffer = fs.readFileSync(syllabusPdfPath);
//   const syllabusPdfData = new PDFParse(syllabusPdfPath);
//   const syllabusText = await syllabusPdfData.getText();
//   syllabusText = syllabusText.text;

//   // const images = [];
//   // const pdfDoc = await pdfjsLib.getDocument(questionPdfPath).promise;

//   // for (let i = 1; i <= pdfDoc.numPages; i++) {
//   //   const page = await pdfDoc.getPage(i);
//   //   const ops = await page.getOperatorList();

//   //   for (let j = 0; j < ops.fnArray.length; j++) {
//   //     if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
//   //       const imgName = `page${i}_img${j}.png`;
//   //       const imgPath = path.join(imageDir, imgName);
//   //       fs.writeFileSync(imgPath, "");
//   //       images.push(imgPath);
//   //     }
//   //   }
//   // }
//   console.log("running")
//   return { questionText, answerText, syllabusText };
// }

async function extractPdfContent(questionPdfPath, answerPdfPath = "", syllabusPdfPath) {

  // QUESTION
  const questionBuffer = await fs.promises.readFile(questionPdfPath);
  const questionParser = new PDFParse(new Uint8Array(questionBuffer), { verbosity: 0 });
  const questionResult = await questionParser.getText();
  const questionText = questionResult.text;

  // ANSWER (optional)
  let answerText = "";
  if (answerPdfPath) {
    const answerBuffer = await fs.promises.readFile(answerPdfPath);
    const answerParser = new PDFParse(new Uint8Array(answerBuffer), { verbosity: 0 });
    const answerResult = await answerParser.getText();
    answerText = answerResult.text;
  }

  // SYLLABUS
  const syllabusBuffer = await fs.promises.readFile(syllabusPdfPath);
  const syllabusParser = new PDFParse(new Uint8Array(syllabusBuffer), { verbosity: 0 });
  const syllabusResult = await syllabusParser.getText();
  const syllabusText = syllabusResult.text;

  return { questionText, answerText, syllabusText };
}

// API Call
async function callAzureInference(prompt) {
  const url = `${ENDPOINT}/chat/completions`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };

  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: "You are an assistant that extracts exam questions into JSON." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  };

  const response = await axios.post(url, body, { headers });
  return response.data;
}

// Chunk text
function chunkText(text, maxChars = 4000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

// Process the PDF
async function processPdf(questionPdfPath, outputJson = "questions.json") {
  const { questionText, answerText, syllabusText } = await extractPdfContent(questionPdfPath,"assets/CS1FinalAnswerKey.pdf", "assets/CS_2026_Syllabus.pdf");
  const chunks = chunkText(questionText);
  const results = [];

  for (let i = 2; i < chunks.length; i++) {
    const chunkId = i + 1;
    const chunk = chunks[i];

    const prompt = `
        You are an expert exam-paper analyzer and JSON formatter.

        You are given 3 types of inputs:
        1. **Exam Questions (PDF text)** — Contains GATE exam questions with options, figures (if any), question type (MCQ/MSQ/NAT), and exam year.
        2. **Answer Key (PDF text)** — Contains correct answers and marks/score for each question.
        3. **Syllabus (text or JSON)** — Contains the official GATE syllabus with chapters (sections) and topics.

        Your task is to generate a JSON array of question objects strictly following the provided MongoDB schema.

        --------------------------------------------------
        TASK DETAILS
        --------------------------------------------------

        For EACH question in exam.pdf:

        1. Extract:
          - questionText (exact text, preserve symbols, equations, formatting)
          - options (if present, store as ["A) ...", "B) ...", ...])
          - picture:
              - If the question references a diagram/figure, set a placeholder string like "figure_qXX.png"
              - Otherwise set null

        2. From answerkey.pdf:
          - questionType:
            - MCQ → single correct option
            - MSQ → multiple correct options
            - NAT → numerical answer (options array should be empty)
          - Extract the correct answer(s)
            - MCQ/MSQ → option labels like ["A"], ["B","D"]
            - NAT → numeric value as string, e.g. ["42"]
          - Extract score (1, 2, or other as specified)

        3. From syllabus.pdf:
          - Assign the most appropriate chapter (mandatory)
          - Assign the most specific topic (if identifiable, else null)
          - Use only syllabus-defined chapter and topic names

        4. Auto-tag difficultyLvl using the following logic:
          - Easy:
              - Direct formula application
              - One-step reasoning
              - Basic concept recall
          - Medium:
              - Multi-step reasoning
              - Concept + calculation
              - Moderate logical analysis
          - Hard:
              - Tricky edge cases
              - Deep conceptual understanding
              - Lengthy derivation or combined concepts

        5. Populate exam metadata:
          - category: "Gate"
          - branch: "Computer Science and Information Technology"
          - code: "CS"
          - year: Extract from exam.pdf (or provided metadata)

        --------------------------------------------------
        OUTPUT REQUIREMENTS
        --------------------------------------------------

        • Output ONLY valid JSON (no explanation, no markdown).
        • Output must be an array of objects.
        • Every object MUST conform exactly to this schema:

        {
          "questionText": String,
          "picture": String | null,
          "options": [String],
          "answer": [String],
          "score": Number,
          "questionType": "MCQ" | "MSQ" | "NAT",
          "exam": {
            "category": String,
            "branch": String,
            "code": String,
            "year": Number
          },
          "chapter": String,
          "topic": String | null,
          "difficultyLvl": "Easy" | "Medium" | "Hard"
        }

        --------------------------------------------------
        VALIDATION RULES
        --------------------------------------------------

        • options must be empty for NAT questions
        • answer must never be empty
        • chapter must never be null
        • difficultyLvl must always be assigned
        • Use consistent option labeling: A), B), C), D)
        • Do NOT hallucinate missing data
        • If any value cannot be confidently determined, set it to null (except mandatory fields)

        --------------------------------------------------
        BEGIN PROCESSING
        --------------------------------------------------

        Read exam.pdf, answerkey.pdf, and syllabus.pdf.
        Generate the final JSON now.

        Chunk ${chunkId}:
        ${chunk}

        For answer, score and questionType, refer answer table: ${answerText}
        And for chapter and topic, refer syllabus text: ${syllabusText}
    `;

    try {
      const result = await callAzureInference(prompt);
      const output = result?.choices?.[0]?.message?.content || "";
      try {
        const parsed = JSON.parse(output);
        if (Array.isArray(parsed)) results.push(...parsed);
        else results.push(parsed);
      } catch {
        console.warn(`⚠️ Could not parse chunk ${chunkId}, saving raw text`);
        results.push({ raw_output: output });
      }
    } catch (err) {
      console.error(`❌ Error processing chunk ${chunkId}:`, err.message);
    }
  }

  fs.writeFileSync(outputJson, JSON.stringify(results, null, 2), "utf-8");
  console.log(`✅ Extracted ${results.length} questions saved to ${outputJson}`);
}

// Run
processPdf("assets/CS124S5.pdf", "CS-2024-2.json");

// async function test(){
//   const url = `${ENDPOINT}/chat/completions`;
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${TOKEN}`,
//   };
//   console.log(TOKEN, ENDPOINT)
//   const body = {
//     model: MODEL,
//     messages: [
//       { role: "system", content: "You are an assistant that answer basic questions." },
//       { role: "user", content: "What is the capital of India?" },
//     ],
//     temperature: 0,
//   };

//   const response = await axios.post(url, body, { headers });
//   console.log("answer: ", response.data.choices[0].message.content);
//   return ;
// }

// (async () => {
//   try {
//     await test();
//   } catch (err) {
//     console.error(err.response?.data || err);
//   }
// })();
