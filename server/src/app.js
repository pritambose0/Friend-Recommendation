import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
//http://localhost:8000/api/v1/users/register

//Routes Declarations

export { app };
