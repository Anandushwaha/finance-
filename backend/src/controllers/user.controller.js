import asyncHandler from "../utils/asyncHandler.js";
import errorResponse from "../utils/errorResponse.js";
import uploadOnCloudinary from "../utils/cloudinaryfileuploading.js";
import { User } from "../models/userRegister.model.js";
import apiResponse from "../utils/apiResponse.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  // Validate required fields
  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    console.log("Validation Error: All fields are required");
    throw new errorResponse(400, "All fields are required");
  }

  // Check if user already exists
  const userExisted = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log("User Existed:", userExisted);
  if (userExisted) {
    throw new errorResponse(400, "User already exists");
  }

  // Check for uploaded file
  const temporaryFilePath = req.file?.path;
  if (!temporaryFilePath) {
    console.log("Validation Error: Avatar is required");
    throw new errorResponse(405, "Avatar is required");
  }

  // Upload to Cloudinary
  const avatar = await uploadOnCloudinary(temporaryFilePath);
  console.log("Uploaded Avatar:", avatar);
  if (!avatar || !avatar.url) {
    console.log("Error: Avatar upload failed");
    throw new errorResponse(500, "Error uploading avatar");
  }

  // Create user in database
  let user;
  try {
    user = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      username: username.toLowerCase(),
      password,
    });
  } catch (error) {
    console.log("Database Error:", error.message);
    throw new errorResponse(500, "Error saving user to database");
  }

  // Fetch user without sensitive fields
  const userCreatedOrNot = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!userCreatedOrNot) {
    console.log("Error: User not found after creation");
    throw new errorResponse(500, "Could not save data in database");
  }

  console.log("User Created Successfully:", userCreatedOrNot);

  return res
    .status(200)
    .json(
      new apiResponse(200, userCreatedOrNot, "User registered successfully")
    );
});
const loginuser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || email) {
    throw new errorResponse(405, "we need all fields to proceed");
  }
  const finduseruser = await User.findOne({ $or: [{ email }, { username }] });
  if(!finduseruser){
    throw new errorResponse(400,"user does not exist in database")

  }
  if(finduseruser){
    const isMatch = await bcrypt.compare(password, finduseruser.password);
  }
});
export { register, loginuser };
