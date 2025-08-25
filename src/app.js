import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import usersRouter from "./routes/users.js";
import payrollRouter from "./routes/payroll.js";
import payrunRouter from "./routes/payrun.js";
import departmentsRouter from "./routes/departments.js";
import rolesRouter from "./routes/roles.js";

dotenv.config();

let isMongoConnected = false;

async function ensureMongoConnection() {
  if (isMongoConnected) return;
  const MONGO_URI = process.env.MONGO_URI;
  await mongoose.connect(MONGO_URI, { dbName: "hrms_db" });
  console.log("Connected to MongoDB", MONGO_URI);
  isMongoConnected = true;
}

export function createApp({ basePath = "" } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Kick off mongo connection; don't block route mounting
  ensureMongoConnection().catch((err) => {
    console.error("Mongo connection error", err);
  });

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the HRMS API" });
  });

  app.get(`${basePath}/health`, (req, res) => {
    res.json({ ok: true, service: "hrms-server" });
  });

  app.use(`${basePath}/users`, usersRouter);
  app.use(`${basePath}/payroll`, payrollRouter);
  app.use(`${basePath}/payrun`, payrunRouter);
  app.use(`${basePath}/departments`, departmentsRouter);
  app.use(`${basePath}/roles`, rolesRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server error" });
  });

  return app;
}
