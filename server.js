import express from "express";
import session from "express-session";
import cors from "cors";
import initDB from "./db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: "sqlite-secret",
  resave: false,
  saveUninitialized: true,
}));

const db = await initDB();

app.use(authRoutes(db));
app.use(projectRoutes(db));

app.listen(PORT, () => {
  console.log(`SQLite server running at http://localhost:${PORT}`);
});
