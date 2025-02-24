import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
import express, { Application, json, urlencoded } from "express";
import connectDb from "./config/db.js";
import urlsRouter from "./routes/urls.js";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import cors from "cors";

const app: Application = express();

// Body Parser
app.use(urlencoded({ extended: true }));
app.use(json());

// Enable CORS for all routes
app.use(cors());

app.use("/", indexRouter);
app.use("/api", urlsRouter);
app.use("/auth", usersRouter);

const PORT = process.env.PORT || "4040";

app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});
