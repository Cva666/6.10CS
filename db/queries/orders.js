import db from "#db/client";

export async function createOrder(date, note, id) {
  const sql = `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  const {
    rows: [order],
  } = await db.query(sql, [date, note, id]);
  return order;
}

export async function getOrdersByUser(userId) {
  const sql = `
  SELECT * FROM orders
  WHERE user_id = $1;`;

  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrderById(id) {
  const sql = `
  SELECT * FROM orders
  WHERE id = $1;`;

  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}
