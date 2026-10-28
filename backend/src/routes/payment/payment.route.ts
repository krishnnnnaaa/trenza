import { Router } from "express";
import { verifyPayment } from "../../controllers/payments/payment.controller.js";

const router = Router();

router.post("/verify", verifyPayment)

export default router;