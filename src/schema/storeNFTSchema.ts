import { z } from "zod";

export const StoreNFTSchema=z.object({
    searchQuery: z.string().nullable().optional(),
    orderBy: z.string().optional(),
})

export const StoreNFTDetailSchema=z.object({
    id:z.string().nullable().optional(),

})

export const StoreNFTCollectionSchema=z.object({
    contract_id:z.string().nullable().optional(),
    searchQuery: z.string().nullable().optional(),
    orderBy: z.string().optional(),
})