import express from "express";
import { getOrderById, getOrdersByUser, createOrder } from "#db/queries/orders";
import {
  getProductsbyOrderId,
  createOrderProduct,
} from "#db/queries/orders_products";
import { getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.post("/", requireUser, requireBody(["date"]), async (req, res) => {
  const userId = req.user.id;
  const { date, note } = req.body;
  const order = await createOrder(date, note, userId);

  res.status(201).send(order);
});

router.get("/", requireUser, async (req, res) => {
  const userId = req.user.id;
  const orders = await getOrdersByUser(userId);
  res.send(orders);
});

router.get("/:id", requireUser, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const order = await getOrderById(orderId);

  if (!order) {
    return res.status(404).send({ error: "Order not found" });
  }

  if (Number(order.user_id) !== Number(userId)) {
    return res
      .status(403)
      .send({ error: "Forbidden: You do not own this order" });
  }

  res.send(order);
});

router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]), // Checked FIRST per API spec
  async (req, res) => {
    const orderId = req.params.id;
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const order = await getOrderById(orderId);
    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    if (Number(order.user_id) !== Number(userId)) {
      return res
        .status(403)
        .send({ error: "Forbidden: You do not own this order" });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(400).send({ error: "Product does not exist" });
    }

    const createdRecord = await createOrderProduct({
      orderId,
      productId,
      quantity,
    });

    res.status(201).send(createdRecord);
  },
);

router.get("/:id/products", requireUser, async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  const order = await getOrderById(orderId);
  if (!order) {
    return res.status(404).send({ error: "Order not found" });
  }

  if (Number(order.user_id) !== Number(userId)) {
    return res
      .status(403)
      .send({ error: "Forbidden: You do not own this order" });
  }

  const products = await getProductsbyOrderId(orderId);
  res.send(products);
});

export default router;
