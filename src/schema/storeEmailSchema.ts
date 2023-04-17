import { z } from "zod";

export const StoreEmailSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
  message: z.string(),
});
export const StoreGetEmailSchema = z.object({});
