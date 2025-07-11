import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import md5 from 'md5';

export default async function initDB() {
  const db = await open({
    filename: './data.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      salt TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      cid INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      project_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      user_id INTEGER,
      cid INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (cid) REFERENCES categories(cid)
    );
  `);

  console.log("Database initialized");
  // Insert dummy data if tables are empty
  const [{ count }] = await db.all("SELECT COUNT(*) as count FROM users");
  if (count === 0) {
    await db.exec(`
      INSERT INTO users (username, password, salt) VALUES
        ('john', '${md5(md5("pass123") + "salt123")}', 'salt123'),
        ('alice', '${md5(md5("secret") + "salt456")}', 'salt456');

      INSERT INTO categories (name) VALUES ('Design'), ('Development');

      INSERT INTO projects (title, user_id, cid) VALUES
        ('Website Redesign', 1, 1),
        ('React App', 2, 2),
        ('Logo Design', 1, 1),
        ('API Integration', 2, 2);
    `);
  }

  console.log("Dummy data inserted if tables were empty");
  return db;
}
