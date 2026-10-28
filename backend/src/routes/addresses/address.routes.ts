import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../controllers/addresses/address.controller.js";

const router = Router();

router.get("/", getAddresses);
router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;