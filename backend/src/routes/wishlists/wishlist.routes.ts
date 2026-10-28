import { Router } from "express";
import {
  addWishlistItem,
  deleteWishlistItem,
  getWishlist,
} from "../../controllers/wishlists/wishlist.controller.js";

const router = Router();

router.get("/", getWishlist);
router.post("/items", addWishlistItem);
router.delete("/items/:id", deleteWishlistItem);

export default router;