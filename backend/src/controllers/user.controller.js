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
        alert("User already exist")
        return
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
        alert("User does not exists")
        return
    }

    const validCredentials = await user.isPasswordCorrect(password)
    if(!validCredentials){
        console.log("Invalid Credentials", validCredentials)
        return
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
    const {newName, newUsername} = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: newName,
                username: newUsername
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
                avatar: newAvatar
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

const getAllAttempts = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const attempts= await Attempt.find({
        user: userId
    })
    if(!attempts){
        throw new apiError(400, "Error in fetching all attempts")
    }

    return res.status(200).json(
        new apiResponse(200, attempts, "all attempts of user fetched successfully")
    )
})

const sayHii = asyncHandler(async () => {
    return res.status(200).json(new apiResponse(200, {}, "hii"))
})


export {registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updateAvatar, getAllAttempts, sayHii}