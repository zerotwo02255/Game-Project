import { z } from "zod";

export const gameSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().nullable().optional(),

  release_date: z.string().nullable().optional(),

  cover_url: z.string().nullable().optional(),

  status: z.enum([
    "bucket_list",
    "playing",
    "completed",
    "dropped",
  ]),

  rating: z
    .number()
    .min(0)
    .max(10)
    .nullable()
    .optional(),

  progress: z
    .number()
    .int()
    .min(0)
    .max(100),

  notes: z.string().nullable().optional(),
});