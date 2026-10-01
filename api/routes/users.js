import express from "express";
import { loginUser } from "#db/queries/users";
import { createUser } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    const newUser = await createUser(username, password);
    const token = createToken({ id: newUser.id });
    res.status(201).send(token);
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    if (!user) return res.status(401).send("Invalid Login");
    const token = createToken({ id: user.id });
    res.send(token);
  },
);

export default router;
