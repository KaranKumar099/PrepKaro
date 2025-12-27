import fs from "fs";
import path from "path";
import axios from "axios";
import {pdf} from "pdf-parse";         // for text extraction
import * as pdfjsLib from "pdfjs-dist"; // for image extraction (with custom logic)

const TOKEN = process.env.OPENAI_API_KEY;
const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1-mini";

// -----------------------
// Extract text + images
// -----------------------
async function extractPdfContent(questionPdfPath, answerPdfPath="", syllabusPdfPath, imageDir = "images") {
  fs.mkdirSync(imageDir, { recursive: true });

  const questionDataBuffer = fs.readFileSync(questionPdfPath);
  const questionPdfData = await pdf(questionDataBuffer);
  const questionText = questionPdfData.text;

  let answerText; 
  if(answerPdfPath != ""){
    const answerDataBuffer = fs.readFileSync(answerPdfPath);
    const answerPdfData = await pdf(answerDataBuffer);
    answerText = answerPdfData.text;
  }else{
    answerText = "";
  }

  const syllabusDataBuffer = fs.readFileSync(syllabusPdfPath);
  const syllabusPdfData = await pdf(syllabusDataBuffer);
  const syllabusText = syllabusPdfData.text;

  const images = [];
  const pdfDoc = await pdfjsLib.getDocument(questionPdfPath).promise;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const ops = await page.getOperatorList();

    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
        const imgName = `page${i}_img${j}.png`;
        const imgPath = path.join(imageDir, imgName);
        fs.writeFileSync(imgPath, "");
        images.push(imgPath);
      }
    }
  }
  
  return { questionText, images, answerText, syllabusText };
}

// -----------------------
// API Call
// -----------------------
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

// -----------------------
// Chunk text
// -----------------------
function chunkText(text, maxChars = 4000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChars) {
    chunks.push(text.slice(i, i + maxChars));
  }
  return chunks;
}

// -----------------------
// Process the PDF
// -----------------------
async function processPdf(questionPdfPath, outputJson = "questions.json") {
  const { questionText, images, answerText, syllabusText } = await extractPdfContent(questionPdfPath,"assets/CS2_Keys.pdf", "assets/CS_2026_Syllabus.pdf");
  const chunks = chunkText(questionText);
  const results = [];

  for (let i = 1; i < chunks.length; i++) {
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
          "answer": exact answer text or option letter (e.g., 'A,B,D')",
          "score": "string (e.g., '2')"
          "questionType": "MCQ | MSQ | NAT",
          "exam": "...",
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

        Images you can reference if relevant: ${JSON.stringify(images)}
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

// -----------------------
// Run
// -----------------------
processPdf("assets/CS22025.pdf", "questions6.json");
