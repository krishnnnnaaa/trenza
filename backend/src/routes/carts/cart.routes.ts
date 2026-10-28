import { Router } from "express";
import {
	clearCart,
	createCart,
	deleteCartItem,
	getCart,
	updateCartItem,
} from "../../controllers/carts/cart.controller.js";

const router = Router();

router.get("/", getCart);
router.post("/add", createCart);
router.patch("/items/:id", updateCartItem);
router.delete("/items/:id", deleteCartItem);
router.delete("/items", clearCart);

export default router;