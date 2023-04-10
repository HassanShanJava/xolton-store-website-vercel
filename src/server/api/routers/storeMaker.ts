import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreMakerSchema } from "~/schema/storeMakerSchema";
import { prisma } from "~/server/db";

export const storeMakerRouter = router({
  getStoreMaker: publicProcedure
    .input(StoreMakerSchema)
    .query(async ({ ctx, input }) => {
      //   console.log(ctx, 'ctx');
      // ctx.prisma.
      try {
        const makerOrder = await ctx.prisma.storeMakerOrder.findMany({
          where: {
            store_id: "641ad2a5a5275ac1ff1e0646",
          },
          select: {
            id: true,
            store_id: true,
            nft_id: true,
            is_listed: true,
            isOrderAsk: true,
            signer: true,
            baseAccount: true,
            nftContract: true,
            price: true,
            tokenId: true,
            tax: true,
            nonce: true,
            signed_v: true,
            signed_r: true,
            signed_s: true,
            created_at: true,
            updated_at: true,
            store_nft: {
              select: {
                id: true,
                store_id: true,
                contract_id: true,
                name: true,
                external_link: true,
                price: true,
                min_price: true,
                royalty: true,
                service_fee: true,
                thumb: true,
                tax: true,
                ipfs_url: true,
                description: true,
                tags: true,
                donation: true,
                blockchian_type: true,
                sell_type: true,
                status: true,
                item_id: true,
                media: true,
                token_id: true,
                block_reason: true,
                transaction_id: true,
                block_id: true,
                contract_address: true,
                creator_id: true,
                owner_id: true,
                collection_id: true,
                media_type: true,
                total_minted: true,
                royalties: true,
                copies: true,
                is_active: true,
                is_deleted: true,
                is_listed: true,
                is_featured: true,
                is_trending: true,
                is_blocked: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        });

        console.log(makerOrder, "makerOrder");
        return makerOrder;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
