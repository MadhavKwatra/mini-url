import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import urlsRouter from "./routes/urls.js";
import indexRouter from "./routes/index.js";
dotenv.config({ path: "./.env" });
import cors from "cors";

const app = express();

// Body Parser
app.use(urlencoded({ extended: true }));
app.use(json());

// Enable CORS for all routes
app.use(cors());

app.use("/", indexRouter);
app.use("/api", urlsRouter);
const PORT = process.env.PORT || "4040";

app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is running at ${PORT}`);
});
