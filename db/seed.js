import db from "#db/client";

import { createOrder } from "#db/queries/orders";
import { createProduct } from "#db/queries/products";
import { createUser } from "#db/queries/users";
import { createOrderProduct } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "password123");
  const order1 = await createOrder("09/06/1515", "note1", user1.id);

  for (let i = 1; i <= 10; i++) {
    await createProduct("title" + i, "description" + i, 100 * i);
  }

  for (let i = 1; i <= 5; i++) {
    await createOrderProduct(order1.id, i, 1 * i);
  }
}
