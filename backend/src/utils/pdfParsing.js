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
  const { questionText, answerText, syllabusText } = await extractPdfContent(questionPdfPath,"assets/CS_ANS_GATE2023.pdf", "assets/CS_2026_Syllabus.pdf");
  const chunks = chunkText(questionText);
  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkId = i + 1;
    const chunk = chunks[i];

    const prompt = `
        You are an expert exam-paper analyzer and JSON formatter.

        You are given 3 types of inputs:
        1. **Exam Questions (PDF text)** — Contains questions, diagrams, and options.
        2. **Answer Key (PDF text)** — Contains the correct answers, marks per question, and sometimes question types (MCQ, True/False, Numerical, etc.).
        3. **Syllabus (text or JSON)** — Lists all topics, subtopics, and chapters for the subject.

        Your job is to combine information from all three and produce a unified JSON output array of question objects.

        Each object must have the following structure:

        {
          "questionText": "full text of the question",
          "picture": "filename.png" or null,
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."] or [] if not applicable,
          "answer": ['B'] for MCQ or ['A', 'C', 'D'] for MSQ",
          "score": number like 1 or 2,
          "questionType": "MCQ | MSQ | NAT",
          "exam": {
            "category": "Gate",
            "branch": "Computer Science and Information Technology Set 2",
            "code": "CS2",
            "year": 2025
          },
          "chapter": "Chapter name from syllabus",
          "topic": "Topic name from syllabus",
          "difficultyLvl": "Easy/Medium/Hard"
        }

        Guidelines:
        - Match each question in the exam text with its corresponding entry in the answer key using the question number.
        - If marks or type are missing, infer from context or mark as null.
        - Use the syllabus to determine the chapter and topic of each question by semantic similarity between the question text and syllabus terms.
        - Ensure JSON is **strictly valid** and **fully enclosed in [ ... ]**.
        - Never include explanations, reasoning, or commentary — only return JSON.
        - If a question cannot be matched to an answer key or syllabus entry, still include it but set the missing fields to null.

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
processPdf("assets/cs_2023.pdf", "CS-2023.json");

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
