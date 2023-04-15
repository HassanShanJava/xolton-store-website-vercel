import { z } from "zod";

export const StoreCollectionSchema=z.object({
    id:z.string().optional(),
    contract_id:z.string().optional(),
})