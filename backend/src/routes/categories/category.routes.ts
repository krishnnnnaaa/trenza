import { Router } from "express";
import {
	createCategory,
	getCategories,
	getCategoryProducts,
	getOneCategory,
} from "../../controllers/categories/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get('/', getCategories);
router.get('/:slug', getOneCategory)
router.get('/:slug/products', getCategoryProducts)


export default router;