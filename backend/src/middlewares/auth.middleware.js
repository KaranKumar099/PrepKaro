import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

export const jwtVerification = asyncHandler(async (req, _, next) => {
    try {
        // console.log("cookies : ", req.cookies)
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken
        // console.log("backend tokken : ", token)
        if(!token){
            throw new apiError(400, "unauthorized request")
        }
        // console.log(process.env.ACCESS_TOKEN_SECRET)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("backend decoded token : ", decodedToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(401, "Invalid Access Token 1");
        }

        req.user=user
        next()        
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new apiError(401, "Access token expired");
        }
        throw new apiError(401, "Invalid access token 0");
    }
})