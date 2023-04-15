import { z } from "zod";

export const BlogsDeleteSchema = z.object({
  id: z.any(),
});
