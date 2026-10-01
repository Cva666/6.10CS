import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username`;

  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserByUsername(username) {
  const sql = `
    SELECT * FROM users
    WHERE username = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);
  return user;
}

export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query(`SELECT * FROM users WHERE id = $1;`, [id]);
  return user;
}

export async function loginUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  return user;
}

export function authenticate(req, res, next) {}
