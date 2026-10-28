import { Router } from "express";
import { getOneProduct, getProducts, getSelectedProducts } from "../../controllers/products/product.controller.js";

const router = Router()

router.get('/', getProducts);
router.post('/selected', getSelectedProducts);
router.get('/:slug', getOneProduct)

export default router