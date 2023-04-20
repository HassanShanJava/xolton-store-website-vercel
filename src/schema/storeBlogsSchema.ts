import { z } from "zod";

export const BlogsDeleteSchema = z.object({
  id: z.any(),
  store_id:z.any()
});
