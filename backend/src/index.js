import dotenv from "dotenv";
import {dbConnect} from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 8000;

dbConnect()
    .then(() => {
        app.listen(port, () => {
            console.log(`App is listening on port : ${port}`);
        });
    })
    .catch((err) => {
        console.log("Error ki MKC :: MongoDB connection Failed : ", err);
    });