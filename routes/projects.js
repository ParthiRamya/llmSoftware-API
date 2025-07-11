import express from "express";

const router = express.Router();

export default function projectRoutes(db) {
  router.get("/projects", async (req, res) => {
    const { page = 1, sort = "recent" } = req.query;
    const limit = 2;
    const offset = (page - 1) * limit;

    let orderBy = "p.created_at DESC";
    if (sort === "category") orderBy = "c.name ASC";
    else if (sort === "username") orderBy = "u.username ASC";
    else if (sort === "title") orderBy = "p.title ASC";

    const projects = await db.all(`
      SELECT p.title AS project_title, u.username, c.name AS category_name, p.created_at
      FROM projects p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN categories c ON p.cid = c.cid
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [{ total }] = await db.all(`SELECT COUNT(*) AS total FROM projects`);
    const totalPages = Math.ceil(total / limit);

    res.json({ data: projects, totalPages });
  });

  return router;
}
