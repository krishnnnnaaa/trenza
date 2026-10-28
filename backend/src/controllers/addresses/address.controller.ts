import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../../db/index.js";
import { addresses } from "../../db/schema/app.js";
import { auth } from "../../lib/auth.js";

const requiredAddressFields = [
  "fullName",
  "phone",
  "addressLine1",
  "city",
  "state",
  "postalCode",
  "country",
] as const;

// GET /api/addresses - Get the current user's addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id));

      if(userAddresses.length === 0){
        return res.status(404).json({
          error: "No saved address found. Add one to continue shopping."
        })
      }

    return res.status(200).json({
      data: userAddresses,
    });
  } catch (error) {
    console.error("GET /addresses error:", error);
    return res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// POST /api/address - Create an address for the current user
export const createAddress = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const hasMissingRequiredField = requiredAddressFields.some(
      (field) =>
        typeof req.body[field] !== "string" ||
        req.body[field].trim().length === 0,
    );

    if (hasMissingRequiredField) {
      return res
        .status(400)
        .json({ error: "All required address fields are required" });
    }

    if (
      addressLine2 !== undefined &&
      addressLine2 !== null &&
      typeof addressLine2 !== "string"
    ) {
      return res.status(400).json({ error: "Invalid address line 2" });
    }

    if (typeof isDefault !== "boolean") {
      return res.status(400).json({ error: "isDefault must be a boolean" });
    }

    const createdAddress = await db.transaction(async (tx) => {
      const userAddresses = await tx
        .select({ id: addresses.id })
        .from(addresses)
        .where(eq(addresses.userId, session.user.id));

      const shouldBeDefault = isDefault || userAddresses.length === 0;

      if (shouldBeDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(addresses.userId, session.user.id));
      }

      const [address] = await tx
        .insert(addresses)
        .values({
          userId: session.user.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2?.trim() || null,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
          isDefault: shouldBeDefault,
        })
        .returning();

      return address;
    });

    return res.status(201).json({
      data: createdAddress,
    });
  } catch (error) {
    console.error("POST /addresses error:", error);
    return res.status(500).json({ error: "Failed to create address" });
  }
};

// PATCH /api/address/:id - Update an address belonging to the current user
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const [existingAddress] = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)),
      );

    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const providedFields = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    if (
      Object.keys(providedFields).every(
        (field) => req.body[field] === undefined,
      )
    ) {
      return res.status(400).json({ error: "No address fields provided" });
    }

    for (const field of requiredAddressFields) {
      if (
        req.body[field] !== undefined &&
        (typeof req.body[field] !== "string" ||
          req.body[field].trim().length === 0)
      ) {
        return res
          .status(400)
          .json({ error: `${field} must be a non-empty string` });
      }
    }

    if (
      addressLine2 !== undefined &&
      addressLine2 !== null &&
      typeof addressLine2 !== "string"
    ) {
      return res.status(400).json({ error: "Invalid address line 2" });
    }

    if (isDefault !== undefined && typeof isDefault !== "boolean") {
      return res.status(400).json({ error: "isDefault must be a boolean" });
    }

    const updatedAddress = await db.transaction(async (tx) => {
      if (isDefault === true) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(
            and(
              eq(addresses.userId, session.user.id),
              ne(addresses.id, addressId),
            ),
          );
      }

      const [address] = await tx
        .update(addresses)
        .set({
          ...(fullName !== undefined && { fullName: fullName.trim() }),
          ...(phone !== undefined && { phone: phone.trim() }),
          ...(addressLine1 !== undefined && {
            addressLine1: addressLine1.trim(),
          }),
          ...(addressLine2 !== undefined && {
            addressLine2: addressLine2?.trim() || null,
          }),
          ...(city !== undefined && { city: city.trim() }),
          ...(state !== undefined && { state: state.trim() }),
          ...(postalCode !== undefined && { postalCode: postalCode.trim() }),
          ...(country !== undefined && { country: country.trim() }),
          ...(isDefault !== undefined && { isDefault }),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(addresses.id, addressId),
            eq(addresses.userId, session.user.id),
          ),
        )
        .returning();

      return address;
    });

    return res.status(200).json({
      data: updatedAddress,
    });
  } catch (error) {
    console.error("PATCH /addresses/:id error:", error);
    return res.status(500).json({ error: "Failed to update address" });
  }
};

// DELETE /api/address/:id - Delete an address belonging to the current user
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({ error: "Invalid address ID" });
    }

    const [address] = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id)),
      );

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await db.delete(addresses).where(eq(addresses.id, address.id));

    return res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /addresses/:id error:", error);
    return res.status(500).json({ error: "Failed to delete address" });
  }
};
