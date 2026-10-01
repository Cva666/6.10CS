import db from "#db/client";

export async function createOrderProduct({ orderId, productId, quantity }) {
  const sql = `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  const {
    rows: [orderProduct],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orderProduct;
}

export async function getOrdersByProductId(productId, userId) {
  const sql = `
  SELECT orders.*
  FROM orders
  JOIN orders_products ON orders.id = orders_products.order_id
  WHERE orders_products.product_id = $1
  AND orders.user_id = $2;`;

  const { rows: orders } = await db.query(sql, [productId, userId]);
  return orders;
}

export async function getProductsbyOrderId(orderId) {
  const sql = `
  SELECT products.*, orders_products.quantity
  FROM products
  JOIN orders_products ON products.id = orders_products.product_id
  WHERE orders_products.order_id = $1;`;

  const { rows: products } = await db.query(sql, [orderId]);
  return products;
}
