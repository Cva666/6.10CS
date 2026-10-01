import express from "express";
import { verifyToken } from "#utils/jwt";
import { getUserById } from "#db/queries/users";

import userRouter from "#api/routes/users";
import orderRouter from "#api/routes/orders";
import productRouter from "#api/routes/products";

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    if (payload?.id) {
      const user = await getUserById(payload.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {}
  next();
});

app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);

export default app;
