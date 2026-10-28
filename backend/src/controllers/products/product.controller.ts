import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import type { Request, Response } from "express";
import { categories, productImages, products } from "../../db/schema/app.js";
import { db } from "../../db/index.js";



// GET - /api/products/ - Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      sort,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const parsePrice = (value: unknown): string | undefined => {
      if (typeof value !== "string" || value.trim() === "") {
        return undefined;
      }

      const convertedValue = Number(value);

      return Number.isFinite(convertedValue) ? value : undefined;
    };

    const minimumPrice = parsePrice(minPrice);
    const maximumPrice = parsePrice(maxPrice);
    const currentPage = Math.max(1, +page);

    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filteredConditions = [];
    let categoryId: number | undefined;

    if (typeof category === "string") {
      const findCategory = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category));

      categoryId = findCategory[0]?.id;
    }

    if (typeof search === "string" && search) {
      filteredConditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.slug, `%${search}%`),
          ilike(products.brand, `%${search}%`),
          ilike(sql`array_to_string(${products.tags}, ' ')`, `%${search}%`)
        )
        )
    }

    if (categoryId !== undefined) {
      filteredConditions.push(eq(products.categoryId, categoryId));
    }
    if (minimumPrice !== undefined) {
      filteredConditions.push(gte(products.price, minimumPrice));
    }

    if (maximumPrice !== undefined) {
      filteredConditions.push(lte(products.price, maximumPrice));
    }

    const whereClause =
      filteredConditions.length > 0 ? and(...filteredConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const productList = await db
      .select({
        ...getTableColumns(products),
      })
      .from(products)
      .where(whereClause)
      .orderBy(
        sort === "price_asc"
          ? asc(products.price)
          : sort === "price_desc"
            ? desc(products.price)
            : desc(products.createdAt),
      )
      .offset(offset)
      .limit(limitPerPage);

      const productIds = productList.map((product) => product.id);

      const productImagesList = await db.select().from(productImages).where(inArray(productImages.productId, productIds));

      const productListWithImages = productList.map((product)=> ({
        ...product,
        images: productImagesList.filter((image)=> image.productId === product.id)
      }))
    res.status(200).json({
      data: productListWithImages,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /product/ error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// POST - /api/products/selected - Get Selected Products
export const getSelectedProducts = async (req:Request, res:Response)=> {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Invalid productIds" });
    }

    const selectedProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

    const productImagesList = await db.select().from(productImages).where(inArray(productImages.productId, productIds));

    const selectedProductsWithImages=  selectedProducts.map((product)=> ({
      ...product,
      images: productImagesList.filter((image)=> image.productId === product.id)
    }))

    res.status(200).json({ data: selectedProductsWithImages });
  } catch (error) {
    console.error("POST /product/selected error:", error);
    res.status(500).json({ error: "Failed to fetch selected products" });
  }
}

// POST - /api/products/:slug - Get Product Detail
export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const slugParams = req.params.slug;
    const slug = Array.isArray(slugParams) ? slugParams[0] : slugParams;

    if (!slug || slug === undefined) {
      return res.status(400).json({ error: "Invalid Slug" });
    }

    const [oneProduct] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    if (!oneProduct) {
      return res
        .status(404)
        .json({ error: "Product not found. Please check again." });
    }

    const productImagesList = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, oneProduct.id));

      const [productCategory] = await db.select().from(categories).where(eq(categories.id, oneProduct.categoryId));

    const finalData = {
      ...oneProduct,
      images: productImagesList ?? [],
      categoryName: productCategory?.name ?? null,
      categorySlug: productCategory?.slug ?? null,
    };

    return res.status(200).json({ data: finalData });
  } catch (error) {
    console.error("GET /product/:slug error:", error);
    res.status(500).json({ error: "Failed to get Product" });
  }
};

