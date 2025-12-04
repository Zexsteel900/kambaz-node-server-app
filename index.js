import express from 'express';
import mongoose from 'mongoose';
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from 'cors';
import UserRoutes from './Kambaz/Users/routes.js';
import session from 'express-session';
import 'dotenv/config';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';
import PazzaRoutes from "./Kambaz/Pazza/routes.js";

const app = express();
app.set("trust proxy", 1);
// FRONTEND URL
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ----------------------
// DATABASE CONNECTION
// ----------------------
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ----------------------
// ✅ CORS FIX
// ----------------------
app.use(
    cors({
        origin: [FRONTEND_URL,
                 "https://kambaz-pazza-git-main-jeet-narkhedes-projects.vercel.app",
                 ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.options("*", cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

// ----------------------
// ✅ SESSION FIX (WORKS LOCAL + PRODUCTION)
// ----------------------
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    proxy: true, 
    cookie: {}
};

// LOCALHOST
if (process.env.NODE_ENV === "development") {
    sessionOptions.cookie = {
        sameSite: "lax",  // MUST be lax on localhost
        secure: false     // MUST be false on localhost
    };
}

// PRODUCTION (Render)
if (process.env.NODE_ENV === "production") {
    console.log("Running in production mode");
    sessionOptions.proxy = true; 
    sessionOptions.cookie = {
        sameSite: "none", // allow cross-site cookies
        secure: true      // only works with HTTPS
    };
}

app.use(session(sessionOptions));


// ----------------------
// BODY PARSER
// ----------------------
app.use(express.json());


// ----------------------
// ROUTES
// ----------------------
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PazzaRoutes(app);


// ----------------------
// START SERVER
// ----------------------
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
})
