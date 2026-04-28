import { User } from "../models/user.model.js";
import { Attempt } from "../models/attempt.model.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    console.log("req.body : ", req.body);
    const {name, email, password} = req.body;

    if([name, email, password].some((el)=>!el?.trim())){
        throw new apiError(400, "All fields are required!!")
    }

    const existedUser=await User.findOne({
        $or: [
            {email}
        ]
    })

    if(existedUser){
        throw new apiError(409, "User with this email already exists")
    }

    const createdUser=await User.create({name, email, username: null, password})
    if(!createdUser){
        throw new apiError(400, "error in creating user")
    }

    return res.status(200).json(
        new apiResponse(200, createdUser, "user created successfully")
    )
})

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
}

const loginUser = asyncHandler(async (req, res) => {
    console.log("Req.body =>", req.body);
    const {email, password} = req.body
    if(!email || !password){
        throw new apiError(400, "all fields are required")
    }

    const user = await User.findOne({
        $or: [{email}, {username: email}]
    })

    // console.log("User: ", user)
    if(!user){
        throw new apiError(404, "User does not exist")
    }

    const validCredentials = await user.isPasswordCorrect(password)
    if(!validCredentials){
        throw new apiError(401, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!loggedInUser){
        throw apiError(400, "Error in finding user")
    }

    const options = {
        httpOnly: true,
        secure: true,
    }

    console.log("login success")
    return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new apiResponse(200, {
                        user: loggedInUser,
                        accessToken,
                        refreshToken
                    },"user logged in successfully")
                )
})

const logoutUser = asyncHandler (async (req, res) => {
    if(req.user?._id){
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                }
            },{
                new : true,
            }
        )
    }

    const options = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "user logged out successfully")
        )
})

const getUserProfile = asyncHandler (async (req, res) => {
    const user = req.user

    if(!user){
        throw new apiError(400, "Error in fecthing user")
    }

    return res.status(200).json(new apiResponse(200, user, "user fetched successfully"))
})

const updateUserProfile = asyncHandler (async (req, res) => {
    const {newName, newEmail, newUsername, newTargetExam} = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: newName,
                email: newEmail,
                username: newUsername,
                targetExam: newTargetExam
            }
        },
        {
            new: true
        }
    )
    if(!user){
        throw new apiError(400, "Error in updating user profile")
    }

    return res.status(200).json(
        new apiResponse(200, user, "user profile updated successfully")
    )
})

const updateAvatar = asyncHandler (async (req, res) => {
    const newAvatarLocalFilePath = req.files?.avatar?.[0].path;
    console.log(newAvatarLocalFilePath)

    const newAvatar = await uploadOnCloudinary(newAvatarLocalFilePath)
    if(!newAvatar){
        throw new apiError(400, "Error in uploading new avatar to cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: newAvatar.url
            }
        },
        {new: true}
    )
    if(!user){
        throw new apiError(400, "Error in updating user avatar")
    }

    return res.status(200).json(
        new apiResponse(200, user, "user avatar updated successfully")
    )
})

const getUserPerformance = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const attempts = await Attempt.find({ user: userId, status: 'submitted' })
        .populate('exam')
        .populate('answers.question')
        .sort({ startTime: 1 });

    if (!attempts || attempts.length === 0) {
        return res.status(200).json(new apiResponse(200, { isEmpty: true }, 'No attempts found'));
    }

    const topicMap = {};
    const chapterMap = {};
    const examTypeMap = {};
    const scoreTrend = [];
    const attemptsTable = [];
    let totalAccuracy = 0;
    let bestScorePercent = 0;
    let bestScoreRaw = 0;
    let bestScoreMax = 0;
    let totalTimeSeconds = 0;

    attempts.forEach((attempt) => {
        if (!attempt.exam) return;
        const examTitle = attempt.exam.title || 'Unknown';
        const examCategory = examTitle.split(' ')[0] || 'Other';
        examTypeMap[examCategory] = (examTypeMap[examCategory] || 0) + 1;

        let correct = 0, incorrect = 0, unattempted = 0;
        let positive = 0, negative = 0, totalTime = 0;

        attempt.answers.forEach((ans) => {
            const q = ans.question;
            if (!q) return;
            const topic = q.topic || q.chapter || 'General';
            const chapter = q.chapter || 'General';
            const timeSpent = ans.timespent || 0;
            totalTime += timeSpent;

            if (!topicMap[topic]) topicMap[topic] = { correct: 0, incorrect: 0, unattempted: 0, total: 0, totalTime: 0, marksLost: 0 };
            topicMap[topic].total++;
            topicMap[topic].totalTime += timeSpent;

            if (!chapterMap[chapter]) chapterMap[chapter] = { correct: 0, incorrect: 0, unattempted: 0, total: 0, totalTime: 0, marksLost: 0 };
            chapterMap[chapter].total++;
            chapterMap[chapter].totalTime += timeSpent;

            if (ans.status === 'correct') {
                correct++; positive += (q.score || 0);
                topicMap[topic].correct++; chapterMap[chapter].correct++;
            } else if (ans.status === 'incorrect') {
                incorrect++;
                topicMap[topic].incorrect++; chapterMap[chapter].incorrect++;
                if (q.questionType?.toUpperCase() === 'MCQ') {
                    const penalty = (q.score || 0) / 4;
                    negative += penalty;
                    topicMap[topic].marksLost += penalty;
                    chapterMap[chapter].marksLost += penalty;
                }
            } else {
                unattempted++;
                topicMap[topic].unattempted++; chapterMap[chapter].unattempted++;
            }
        });

        const totalQ = attempt.answers.length;
        const accuracyPercent = Math.round((correct / (totalQ || 1)) * 100);
        const scorePercent = Math.round((Math.max(attempt.score, 0) / (attempt.exam.totalMarks || 1)) * 100);
        totalAccuracy += accuracyPercent;
        totalTimeSeconds += totalTime;
        if (scorePercent > bestScorePercent) {
            bestScorePercent = scorePercent;
            bestScoreRaw = attempt.score;
            bestScoreMax = attempt.exam.totalMarks;
        }

        scoreTrend.push({
            dateLabel: new Date(attempt.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            scorePercent,
            examName: examTitle,
            examType: examCategory,
        });

        attemptsTable.push({
            _id: attempt._id,
            examName: examTitle,
            examType: examCategory,
            date: attempt.startTime,
            score: attempt.score,
            maxScore: attempt.exam.totalMarks,
            scorePercent,
            accuracyPercent,
            correct,
            incorrect,
            skipped: unattempted,
            timeTakenSeconds: totalTime,
            difficulty: attempt.exam.difficulty,
        });
    });

    const buildStats = (map) =>
        Object.entries(map).map(([name, d]) => ({
            name,
            total: d.total,
            correct: d.correct,
            incorrect: d.incorrect,
            skipped: d.unattempted,
            accuracy: Math.round((d.correct / (d.total || 1)) * 100),
            avgTime: Math.round(d.totalTime / (d.total || 1)),
            marksLost: Math.round(d.marksLost * 100) / 100,
        }));

    return res.status(200).json(new apiResponse(200, {
        isEmpty: false,
        summary: {
            totalExams: attempts.length,
            avgAccuracy: Math.round(totalAccuracy / (attempts.length || 1)),
            bestScore: bestScoreRaw,
            bestScoreMax,
            bestScorePercent,
            totalTimeHours: Math.round((totalTimeSeconds / 3600) * 10) / 10,
        },
        attempts: attemptsTable,
        topicStats: buildStats(topicMap).sort((a, b) => b.accuracy - a.accuracy),
        chapterStats: buildStats(chapterMap).sort((a, b) => b.accuracy - a.accuracy),
        scoreTrend,
        examTypeBreakdown: Object.entries(examTypeMap).map(([name, count]) => ({ name, count })),
    }, 'Performance data fetched successfully'));
});

const getAIInsight = asyncHandler(async (req, res) => {
    const { totalExams, avgAccuracy, strongTopics, weakTopics, slowTopics, scoreTrend } = req.body;

    let trend = 'inconsistent';
    if (scoreTrend && scoreTrend.length >= 3) {
        const diff = scoreTrend[scoreTrend.length - 1].scorePercent - scoreTrend[0].scorePercent;
        if (diff > 5) trend = 'improving';
        else if (diff < -5) trend = 'declining';
    }

    const prompt = `You are an expert exam coach. Here is a student's all-time performance data across all their mock exams:

Total exams: ${totalExams}
Average accuracy: ${avgAccuracy}%
Strongest topics overall: ${(strongTopics || []).join(', ') || 'N/A'}
Weakest topics overall: ${(weakTopics || []).join(', ') || 'N/A'}
Most time consuming topics: ${(slowTopics || []).join(', ') || 'N/A'}
Score trend: ${trend}

Give the student:
1. A 2-line overall progress summary
2. The single most important thing they should fix
3. Two specific topics to prioritize this week
4. One habit or strategy recommendation
Keep it concise, honest, and motivating.`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-opus-4-5',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
    }, {
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
    });

    const insight = response.data.content[0].text;
    return res.status(200).json(new apiResponse(200, { insight }, 'AI insight generated'));
});

const getAllAttempts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const attempts = await Attempt.find({ user: userId });
    if (!attempts) throw new apiError(400, 'Error in fetching all attempts');
    return res.status(200).json(new apiResponse(200, attempts, 'all attempts of user fetched successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new apiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new apiError(404, "User not found");

    // Generate a simple 6-digit OTP for this demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.forgotPasswordToken = otp;
    user.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save({ validateBeforeSave: false });

    // In a real app, send this via email. For now, log it.
    console.log(`\n[AUTH] Password Reset OTP for ${email}: ${otp}\n`);

    return res.status(200).json(new apiResponse(200, {}, "Reset OTP sent to email"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        throw new apiError(400, "All fields (email, otp, newPassword) are required");
    }

    const user = await User.findOne({
        email,
        forgotPasswordToken: otp,
        forgotPasswordTokenExpiry: { $gt: Date.now() }
    });

    if (!user) throw new apiError(400, "Invalid or expired OTP");

    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(200).json(new apiResponse(200, {}, "Password reset successful"));
});

export { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updateAvatar, getAllAttempts, getUserPerformance, getAIInsight, forgotPassword, resetPassword };

