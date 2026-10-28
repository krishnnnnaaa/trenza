import { Router } from "express";
import { getCheckoutState } from "../../controllers/checkout/checkout.controller.js";

const router = Router()

router.get('/state', getCheckoutState);

export default router;