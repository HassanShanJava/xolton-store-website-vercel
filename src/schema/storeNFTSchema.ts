import { z } from "zod";

export const StoreNFTSchema = z.object({
  searchQuery: z.string().nullable().optional(),
  orderBy: z.string().optional(),
  contract_id:z.string().optional(),
});

export const StoreNFTOrderSchema = z.object({
  id: z.string().optional(),
  owner: z.string().optional(),
  transaction_id: z.string().optional(),
  is_listed: z.boolean().optional(),
  status: z.string().nullable().optional(),
});

export const StoreOrderNFTSchema = z.object({
  store_id: z.string(),
  nft_id: z.any(),
  nft_name: z.string().optional(),
  total_price: z.number().optional(),
  total_tax: z.number().optional(),
  net_amount: z.number().optional(),
  total_amount: z.number().optional(),
  sell_type: z.string().nullable().optional(),
  transaction_id: z.any(),
  previous_owner_address: z.string().optional(),
  owner_address: z.string().optional(),
  is_deleted: z.boolean().optional(),
});

export const StoreNFTDetailSchema = z.object({
  id: z.any().optional(),
});

export const StoreNFTCollectionSchema = z.object({
  contract_id: z.any().optional(),
  remove_nft_id: z.any().optional(),
  searchQuery: z.string().nullable().optional(),
  orderBy: z.string().optional(),
});
