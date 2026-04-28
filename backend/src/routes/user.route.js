import { loginUser, registerUser, getUserProfile, logoutUser, updateAvatar, updateUserProfile, getUserPerformance, getAIInsight } from "../controllers/user.controller.js";
import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1}
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(jwtVerification, logoutUser)
router.route("/profile").get(jwtVerification, getUserProfile)
router.route("/update-avatar").patch(
    jwtVerification, 
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ]), 
    updateAvatar
)
router.route("/update-profile").patch(jwtVerification, updateUserProfile)
router.route("/performance").get(jwtVerification, getUserPerformance)
router.route("/ai-insight").post(jwtVerification, getAIInsight)

export default router
