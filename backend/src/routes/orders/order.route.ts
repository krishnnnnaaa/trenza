import { Router } from "express";
import {
  createOrder,
  getOrderDetail,
  getOrders,
} from "../../controllers/orders/order.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/:orderId", getOrderDetail);
router.post("/", createOrder);

export default router;