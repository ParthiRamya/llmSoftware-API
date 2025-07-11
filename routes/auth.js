import express from "express";
import md5 from "md5";

const router = express.Router();

export default function authRoutes(db) {
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await db.get("SELECT * FROM users WHERE username = ?", username);
    if (!user) return res.status(401).json({ error: "Invalid username" });

    const hashed = md5(md5(password) + user.salt);
    if (hashed !== user.password) return res.status(401).json({ error: "Invalid password" });

    req.session.user = { user_id: user.user_id, username: user.username };
    res.json({ message: "Login successful" });
  });

  return router;
}
