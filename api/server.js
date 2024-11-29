import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';  // Import your authentication routes
import vacationRoutes from "./routes/vacation.route.js";
import absenceRoutes from "./routes/absence.route.js"
import userRoutes from "./routes/user.route.js";
import timerRouter from "./routes/workingtime.route.js"
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
