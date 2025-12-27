import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigin= ["http://localhost:5173", process.env.CORS_ORIGIN]



app.use(
    cors({
        origin: function(origin, callback){
            if(!origin || allowedOrigin.includes(origin)){
                callback(null, true)
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log("Content-Length:", req.headers['content-length'], "bytes");
    next();
});

// In your app.js
app.use(express.json({ limit: "50mb" }));  // Increase from 10mb
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.post('/api/test-large', express.json({ limit: '50mb' }), (req, res) => {
    console.log("Test endpoint hit!");
    console.log("Body size:", JSON.stringify(req.body).length);
    res.json({ success: true, size: JSON.stringify(req.body).length });
});

// import routers
import attemptRouter from "./routes/attempt.route.js"
import examRouter from "./routes/exam.route.js"
import toolRouter from "./routes/tool.route.js"
import userRouter from "./routes/user.route.js"

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/attempt", attemptRouter);
app.use("/api/v1/tool", toolRouter);


app.use((err, req, res, next) => {
    console.error("=== ERROR CAUGHT ===");
    console.error("Error type:", err.type);
    console.error("Error message:", err.message);
    console.error("Error status:", err.status);
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            error: 'Payload too large',
            limit: '50mb',
            received: req.headers['content-length']
        });
    }
    
    res.status(err.status || 500).json({ error: err.message });
});

export { app };
