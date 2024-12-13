import mongoose from "mongoose";
import { databasename } from "../constants.js";

const database = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${databasename}`);
    console.log("database connected successfully");
  } catch (error) {
    console.log(
      "their was problem while connecting to mongodb database",
      error
    );
    process.exit(1);
  }
};
export default database;
