import { z } from "zod";

export const StoreCollectionSchema=z.object({
    id: z.any(),
    store_id:z.any(),
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
    searchQuery: z.string().optional(),
    page: z.number().optional(),
    first: z.number().optional(),
    rows: z.number().optional(),
})

