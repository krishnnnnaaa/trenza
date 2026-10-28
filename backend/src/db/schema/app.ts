import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { account, session, user } from "./auth.js";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  ...timestamps,
});

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),

  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),

  price: decimal("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  brand: varchar("brand"),
  tags: text("tags").array(),
  stock: integer("stock").notNull(),
  ...timestamps,
});

export const productImages = pgTable("product_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id),

  url: varchar("url", { length: 1000 }).notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  ...timestamps,
});

export const carts = pgTable("carts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id)
    .unique(),

  ...timestamps,
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    cartId: integer("cart_id")
      .notNull()
      .references(() => carts.id),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id),

    quantity: integer("quantity").notNull(),
    ...timestamps,
  },
  (table) => ({
    cartProductUnique: unique().on(table.cartId, table.productId),
  }),
);

export const wishlists = pgTable("wishlists", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id)
    .unique(),

  ...timestamps,
});

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    wishlistId: integer("wishlist_id")
      .notNull()
      .references(() => wishlists.id),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id),

    ...timestamps,
  },
  (table) => ({
    wishlistProductUnique: unique().on(table.wishlistId, table.productId),
  }),
);

export const addresses = pgTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),

  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  addressLine1: varchar("address_line_1", { length: 500 }).notNull(),
  addressLine2: varchar("address_line_2", { length: 500 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  ...timestamps,
});

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id),

  addressId: integer("address_id")
    .notNull()
    .references(() => addresses.id),

  status: varchar("status", { length: 50 }).notNull(),

  totalAmount: decimal("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  ...timestamps,
});

export const orderItems = pgTable("order_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id),

  quantity: integer("quantity").notNull(),

  price: decimal("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id),

    rating: integer("rating").notNull(),
    comment: text("comment"),

    ...timestamps,
  },
  (table) => ({
    userProductUnique: unique().on(table.userId, table.productId),
  }),
);

export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id)
    .unique(),

  provider: varchar("provider", { length: 50 }).notNull(),

  providerPaymentId: varchar("provider_payment_id", {
    length: 255,
  }).unique(),
  providerOrderId: varchar("provider_order_id", {
    length: 255,
  })
    .unique(),

  amount: decimal("amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  status: varchar("status", { length: 50 }).notNull(),

  ...timestamps,
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  items: many(cartItems),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistRelations = relations(wishlists, ({ one, many }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id],
  }),
  items: many(wishlistItems),
}));

export const wishlistItemRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const addressRelations = relations(addresses, ({ one, many }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
  orders: many(orders),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  payment: one(payments),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  cart: one(carts),
  wishlist: one(wishlists),
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  sessions: many(session),
  accounts: many(account),
}));
