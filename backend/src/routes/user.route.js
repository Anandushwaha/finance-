import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/middleware.multer.js";

// Initialize the router
const router = Router();

// Define the route
router.route("/register").post(
  upload.single("avatar"), // Pass the field name as a string
  register
);

// Export the router
export default router;
