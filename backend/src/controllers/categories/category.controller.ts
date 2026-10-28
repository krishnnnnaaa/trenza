import { and, desc, eq, getTableColumns, ilike, inArray, or, sql } from "drizzle-orm";
import { categories, productImages, products } from "../../db/schema/app.js";
import type { Request, Response } from "express";
import { db } from "../../db/index.js";

// POST - /api/categories - Create a Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        slug: slug.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
      })
      .returning();

    return res.status(201).json({ data: category });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({ error: "Category slug already exists" });
    }

    console.error("POST /categories/ error:", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
};

// GET - /api/categories - Get All Categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    let limitPerPage:number | null = null;
    let offset:number | null = null;
    if(Number(limit) > 0){
      limitPerPage = Math.max(1, +limit);
      offset = (currentPage - 1) * limitPerPage;
    }

    const filteredConditions = [];

    if (search) {
      filteredConditions.push(ilike(categories.name, `%${search}%`));
    }

    const whereClause =
      filteredConditions.length > 0 ? and(...filteredConditions) : undefined;

      
      const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereClause);
      
      const totalCount = countResult[0]?.count ?? 0;

      const query = db
      .select({
        ...getTableColumns(categories),
        totalProducts: sql<number>`count(${products.id})`,
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .where(whereClause)
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt))
         
      if (limitPerPage !== null && offset !== null) {
  query.offset(offset).limit(limitPerPage);
}
      
    const categoryList = await query;

    if(!limitPerPage){
     return res.status(200).json({
      data: categoryList
    });  
    }

    res.status(200).json({
      data: categoryList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /category/ error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// GET - /api/categories/:slug - Get Category
export const getOneCategory = async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    if(!slug) return res.status(400).json({error: "Invalid slug"});

    const [category] = await db.select({
        ...getTableColumns(categories)  
    }).from(categories).where(eq(categories.slug, slug));

    if(!category){
       return res.status(404).json({error: 'Category not found'});
    }

    res.status(200).json({data: category});
  }catch (error) {
    console.error("GET /category/:slug error:", error);
    res.status(500).json({ error: "Failed to get category" });
  }
};


// GET - /api/categories/:slug/products - Get Category
export const getCategoryProducts = async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    if(!slug) return res.status(400).json({error: "Invalid slug"});

    const [category] = await db.select({
        ...getTableColumns(categories)  
    }).from(categories).where(eq(categories.slug, slug));

    if(!category){
       return res.status(404).json({error: 'Category not found'});
    }

    const categoryProducts = await db.select().from(products).where(eq(products.categoryId, category.id));


    const productIds = categoryProducts.map((product)=> product.id)

    const productImagesList = await db
          .select()
          .from(productImages)
          .where((inArray(productImages.productId, productIds)));

          const productListWithImages = categoryProducts.map((item)=> ({
            ...item,
            images: productImagesList.filter((imageList)=> imageList.productId === item.id)
          }))

    res.status(200).json({...productListWithImages});
  }catch (error) {
    console.error("GET /category/:slug error:", error);
    res.status(500).json({ error: "Failed to get category" });
  }
};
