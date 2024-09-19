import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
import userRoutes from "./routes/user.routes.js";
import friendRequestRoutes from "./routes/friendRequest.routes.js";
import healthcheckRoute from "./routes/healthcheck.routes.js";

//Routes Declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/friend-requests", friendRequestRoutes);
app.use("/api/v1/healthcheck", healthcheckRoute);

app.use(errorHandler);
export { app };
