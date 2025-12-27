import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: "backend/.env"
});

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)  return null;
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto'})
        fs.unlinkSync(localFilePath);
        console.log("file uploaded successfully at public url : ", response.url)
        return response
    } catch (error) {
        console.log("upload on cloudinary failed::", error)
        return null
    }
}

export {uploadOnCloudinary}

// const folderPath = "assets";
// async function uploadAllFiles() {
//   try {
//     const files = fs.readdirSync(folderPath);
//     for (const file of files) {
//       const fullPath = path.join(folderPath, file);
//       console.log(`Uploading ${file}...`);
//       await uploadOnCloudinary(fullPath);
//     }
//     console.log("✅ All files uploaded!");
//   } catch (err) {
//     console.error("Error reading folder or uploading:", err);
//   }
// }

// uploadAllFiles();