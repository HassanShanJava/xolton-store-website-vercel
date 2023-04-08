import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreNFTSchema, StoreNFTDetailSchema, StoreNFTCollectionSchema } from "~/schema/storeNFTSchema";
import { prisma } from "~/server/db";

export const storeNFTRouter = router({
  getStoreNFTS: publicProcedure
    .input(StoreNFTSchema)
    .query(async ({ ctx, input }) => {
      //   console.log(ctx, 'ctx');
      // ctx.prisma.
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          // where: {
          //   store_id: "642271fe20c73df3d28f4a5e",
          //   is_listed: true,
          //   NOT:{
          //     status:"purchase"
          //   }

          // },
          where: {
            store_id: "642271fe20c73df3d28f4a5e",
            is_listed:true,
          },
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
            store_makerorder: {
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
                v: true,
                r: true,
                s: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        });

        console.log(NFTS, "NFTS");
        return NFTS;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

    getNFTDetail:publicProcedure
    .input(StoreNFTDetailSchema)
    .query(async ({ ctx, input }) => {

      console.log(input,"input")
      try {
        const NFTS = await ctx.prisma.storeNft.findFirst({
          where: {
            id:input.id,
            is_listed:true,
          },
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
        });


        return NFTS;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

    getNFTCollection:publicProcedure
    .input(StoreNFTCollectionSchema)
    .query(async ({ ctx, input })=>{
      console.log(input,"input")
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          where: {
            contract_id:input.contract_id,
            is_listed:true,
          },
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

          take:6,
        });


        return NFTS;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

});
