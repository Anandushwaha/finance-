import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieparser());

import userrouter from "./routes/user.route.js";
app.use("/users", userrouter);
export default app;
