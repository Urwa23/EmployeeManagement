import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';  // Import your authentication routes
import vacationRoutes from "./routes/vacation.route.js";
import absenceRoutes from "./routes/absence.route.js"
import userRoutes from "./routes/user.route.js";
import timerRouter from "./routes/workingtime.route.js"
// const path = require("path");
import path from 'path';

// import ver

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Use authentication routes
app.use(authRoutes);
app.use(vacationRoutes)
app.use(absenceRoutes)
app.use(userRoutes)
app.use(timerRouter)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client","build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
