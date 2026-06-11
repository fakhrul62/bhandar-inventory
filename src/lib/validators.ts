import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email address");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Variant label is required"),
  value: z.string().min(1, "Variant value is required"),
  additionalPrice: z.coerce.number().min(0).default(0),
  stock: z.coerce.number().int().min(0).nullable().optional(),
});

export const productSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Product name is required").max(120),
    description: z.string().max(1500).optional(),
    type: z.enum(["PHYSICAL", "DIGITAL"]),
    price: z.coerce.number().positive("Price must be greater than zero"),
    currency: z.enum(["BDT", "USD"]).default("BDT"),
    stock: z.coerce.number().int().min(0).nullable().optional(),
    imageUrls: z.array(z.string().url()).default([]),
    fileUrl: z.string().url().optional().or(z.literal("")),
    isPublished: z.coerce.boolean().default(false),
    variants: z.array(productVariantSchema).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.type === "PHYSICAL" && value.stock == null) {
      ctx.addIssue({
        code: "custom",
        path: ["stock"],
        message: "Physical products need stock",
      });
    }

    if (value.type === "DIGITAL" && !value.fileUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["fileUrl"],
        message: "Digital products need a file URL",
      });
    }
  });

export const storeSchema = z.object({
  name: z.string().min(2, "Store name is required").max(100),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.coerce.boolean().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  storeId: z.string().min(1),
  buyerName: z.string().min(2, "Name is required").max(80),
  buyerEmail: emailSchema,
  buyerPhone: z.string().min(8, "Phone number is required").max(20),
  paymentMethod: z.enum(["STRIPE", "DEV_MOBILE"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional(),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Cart is empty"),
});
