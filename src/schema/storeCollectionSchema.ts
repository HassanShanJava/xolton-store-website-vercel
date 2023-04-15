import { z } from "zod";

export const StoreCollectionSchema = z.object({
  id: z.any(),
  contract_id: z.any(),
});
