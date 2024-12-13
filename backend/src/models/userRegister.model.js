import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      minlength: 3,
      index: true, // used for efficient searches
    },
    fullName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 8); //this will save the password just before it is saved
  next();
});
userSchema.methods.checkcorrectpassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.accesstokengenerator = function () {
  jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.refreshtokengenerator = function () {
  jwt.sign(
    {
      _id: this._id,
      fullname: this.fullname,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
