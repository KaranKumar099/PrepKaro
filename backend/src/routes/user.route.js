import { loginUser, registerUser, getUserProfile, logoutUser, updateAvatar, updateUserProfile, sayHii, getAllAttempts } from "../controllers/user.controller.js";
import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").get(sayHii)
router.route("/register").post(
    upload.fields([
        {name: "avatar", maxCount: 1}
    ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(jwtVerification, logoutUser)
router.route("/user-profile").get(jwtVerification, getUserProfile)
router.route("/update-avatar").patch(jwtVerification, updateAvatar)
router.route("/update-user-profile").patch(jwtVerification, updateUserProfile)
router.route("/all-attempts").patch(jwtVerification, getAllAttempts)

export default router