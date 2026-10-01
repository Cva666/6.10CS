import express from "express";
import { getOrdersByProductId } from "#db/queries/orders_products";
import { getProducts, getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).send("invalid Product");
  }
  res.send(product);
});

router.get("/:id/orders", requireUser, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).send({ error: "Product not found" });
  }

  const orders = await getOrdersByProductId(productId, userId);
  res.send(orders);
});

export default router;
