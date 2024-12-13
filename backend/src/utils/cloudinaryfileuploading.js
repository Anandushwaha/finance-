import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadoncloudnary = async (temporaryfile) => {
  try {
    if (!temporaryfile) throw new Error("No file provided for upload");

    // Upload file to Cloudinary
    const fileuploaded = await cloudinary.uploader.upload(temporaryfile, {
      resource_type: "image",
      folder: "avatars", // Optional: Organize uploads into a folder
    });

    console.log("File uploaded successfully:", fileuploaded);

    // Remove the local temporary file
    fs.unlinkSync(temporaryfile);

    // Return the uploaded file details
    return fileuploaded;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);

    // Ensure to remove the temporary file in case of failure
    if (fs.existsSync(temporaryfile)) {
      fs.unlinkSync(temporaryfile);
    }

    throw error; // Rethrow the error for proper error handling
  }
};

export default uploadoncloudnary;
