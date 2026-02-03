import fs from "fs"
import mongoose from "mongoose";
import {Question} from "../models/question.model.js"
import dotenv from "dotenv"

dotenv.config({
    path: "backend/.env"
})

const mongoURI = `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`;
console.log("Connecting to:", mongoURI);

await mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertQuestionsIntoDB = async () => {
    const questions = JSON.parse(fs.readFileSync("CS-2022.json", "utf-8"))
    try {
        console.log("uploading questions into DB....")
        await Question.insertMany(questions)
        console.log("uploaded successfully!")
    } catch (error) {
        console.error("Error inserting questions:", error)
    } finally{
        await mongoose.connection.close()
    }
}

insertQuestionsIntoDB()