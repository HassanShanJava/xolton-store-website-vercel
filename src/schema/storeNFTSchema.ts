import { z } from "zod";

export const StoreNFTSchema=z.object({})
export const StoreNFTDetailSchema=z.object({
    id:z.string().nullable(),
})