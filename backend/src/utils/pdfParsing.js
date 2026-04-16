import fs from "fs";
import path from "path";
import axios from "axios";
import { PDFParse } from "pdf-parse";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });

const TOKEN = process.env.OPENAI_API_KEY;
const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "gpt-4o"; // Changed from gpt-4.1 to a valid model name

/**
 * Extracts text from a PDF file.
 */
async function extractPdfText(pdfPath) {
  if (!pdfPath) return "";
  try {
    const dataBuffer = await fs.promises.readFile(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF at ${pdfPath}:`, error.message);
    return "";
  }
}

/**
 * Extracts content from Question, Answer, and Syllabus PDFs.
 */
async function extractPdfContent(questionPdfPath, answerPdfPath = "", syllabusPdfPath = "") {
  console.log("Extracting text from PDFs...");
  const [questionText, answerText, syllabusText] = await Promise.all([
    extractPdfText(questionPdfPath),
    extractPdfText(answerPdfPath),
    extractPdfText(syllabusPdfPath)
  ]);
  return { questionText, answerText, syllabusText };
}

/**
 * API Call to Azure/GitHub Inference
 */
async function callInference(prompt) {
  const url = `${ENDPOINT}/chat/completions`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };

  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: "You are a professional exam paper parser. You convert raw text into structured JSON perfectly." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    response_format: { type: "json_object" } // Requesting JSON mode
  };

  try {
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    console.error("API Call Error:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Clean LLM response to ensure valid JSON
 */
function cleanJsonResponse(content) {
  try {
    // Remove markdown code blocks if present
    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("⚠️ Failed to parse JSON, returning raw content as fallback.");
    return null;
  }
}

/**
 * Chunk text intelligently by searching for double newlines or question numbers.
 */
function chunkText(text, maxChars = 5000) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChars;
    if (endIndex >= text.length) {
      chunks.push(text.slice(startIndex));
      break;
    }

    // Attempt to find a natural break point (double newline) near the maxChars
    const searchArea = text.slice(endIndex - 500, endIndex + 500);
    const breakIndex = searchArea.lastIndexOf("\n\n");

    if (breakIndex !== -1) {
      endIndex = (endIndex - 500) + breakIndex;
    }

    chunks.push(text.slice(startIndex, endIndex).trim());
    startIndex = endIndex;
  }
  return chunks;
}

/**
 * Process the PDF and extract questions.
 */
async function processPdf(questionPdfPath, answerPdfPath = "", syllabusPdfPath = "", outputJson = "extracted_questions.json") {
  try {
    const { questionText, answerText, syllabusText } = await extractPdfContent(
      questionPdfPath,
      answerPdfPath,
      syllabusPdfPath
    );

    if (!questionText) {
      console.error("No text extracted from question PDF. Aborting.");
      return;
    }

    const chunks = chunkText(questionText);
    const results = [];

    console.log(`Processing ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = i + 1;
      const chunk = chunks[i];

      console.log(`Processing chunk ${chunkId}/${chunks.length}...`);

      const prompt = `
        TASK: Extract GATE exam questions into a JSON array following the schema below.
        
        INPUTS:
        1. Exam Chunk: ${chunk}
        2. Answer Key Info: ${answerText}
        3. Syllabus Context: ${syllabusText}

        SCHEMA:
        {
          "questions": [
            {
              "questionText": "Exact text of the question",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "answer": ["A"],
              "score": 1,
              "questionType": "MCQ" | "MSQ" | "NAT",
              "exam": {
                "category": "Gate",
                "branch": "Computer Science and Information Technology",
                "code": "CS",
                "year": 2024
              },
              "chapter": "Chapter from syllabus",
              "topic": "Topic from syllabus",
              "difficultyLvl": "Easy" | "Medium" | "Hard"
            }
          ]
        }

        RULES:
        - Return ONLY a JSON object with a "questions" key.
        - Options MUST be empty for NAT questions.
        - Answer MUST be an array of strings (e.g., ["A"], ["B", "D"], or ["42.5"]).
        - Preserve all mathematical symbols and formatting.
        - If a question is incomplete in this chunk, skip it.
      `;

      try {
        const result = await callInference(prompt);
        const content = result?.choices?.[0]?.message?.content || "";
        const parsed = cleanJsonResponse(content);
        
        if (parsed && parsed.questions) {
          results.push(...parsed.questions);
        } else if (Array.isArray(parsed)) {
          results.push(...parsed);
        }
      } catch (err) {
        console.error(`Error in chunk ${chunkId}:`, err.message);
      }
    }

    // Deduplicate or filter out empty objects if necessary
    const finalResults = results.filter(q => q && q.questionText);

    fs.writeFileSync(outputJson, JSON.stringify(finalResults, null, 2), "utf-8");
    console.log(`✅ Success! Extracted ${finalResults.length} questions to ${outputJson}`);
  } catch (error) {
    console.error("Fatal error in processPdf:", error);
  }
}

// Example Usage
const QUESTION_PDF = "assets/CS224S6_removed.pdf";
const ANSWER_PDF = "assets/CS2FinalAnswerKey.pdf";
const SYLLABUS_PDF = "assets/CS_2026_Syllabus.pdf";

processPdf(QUESTION_PDF, ANSWER_PDF, SYLLABUS_PDF, "CS2-2024-extra.json");
