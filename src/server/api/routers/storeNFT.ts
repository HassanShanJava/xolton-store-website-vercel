import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import {
  StoreNFTSchema,
  StoreNFTDetailSchema,
  StoreNFTOrderSchema,
  StoreNFTCollectionSchema,
} from "~/schema/storeNFTSchema";


export const storeNFTRouter = router({
  updateStoreNFT: publicProcedure
    .input(StoreNFTOrderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input, "update to do");

        const updateInput: any = {
          owner_id: input.owner,
          transaction_id: input.transaction_id,
          is_listed: input.is_listed,
          status: input.status,
        };
        console.log(updateInput, "updateInput");
        const nftUpdate = await ctx.prisma.storeNft.update({
          where: {
            id: input?.id,
          },
          data: updateInput,
        });
        return nftUpdate;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  getStoreNFTS: publicProcedure
    .input(StoreNFTSchema)
    .query(async ({ ctx, input }) => {
      
      const options: any = {
        where: { is_listed: true, status: "" },
        orderBy: {},
      };

      if (input.orderBy) {
        const object: any = input.orderBy.split("-"); //["name","asc"]
        options.orderBy.OR = [];
        // search by name
        if (object[0] == "name") {
          options.orderBy = [
            {
              name: object[1],
            },
          ];
        } else if (object[0] == "price") {
          options.orderBy = [
            {
              price: object[1],
            },
          ];
        }
      }

      if (input.searchQuery) {
        options.where.OR = [];
        // search by name
        options.where.OR.push({
          name: { contains: input.searchQuery, mode: "insensitive" },
        });
      }
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
            is_listed: true,
            status: "",
            ...options.where,
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
                signed_v: true,
                signed_r: true,
                signed_s: true,
                created_at: true,
                updated_at: true,
              },
            },
          },

          orderBy: options.orderBy,
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

  getNFTDetail: publicProcedure
    .input(StoreNFTDetailSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input");

      try {
        const NFTS = await ctx.prisma.storeNft.findFirst({
          where: {
            id: input.id,
            is_listed: true,
            status: "",
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
                signed_v: true,
                signed_r: true,
                signed_s: true,
                created_at: true,
                updated_at: true,
              },
            },
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

  getNFTCollection: publicProcedure
    .input(StoreNFTCollectionSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input");
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
            contract_id: input.contract_id,
            is_listed: true,
            status: "",

          },

          take: 6,
        });
        const filteredNFTS=NFTS.filter((nft)=>nft.id !=input.remove_nft_id)
        return filteredNFTS;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  getNFTHomeCollection: publicProcedure
    .input(StoreNFTCollectionSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input jhome collection");

      const options: any = {
        where: {
          contract_id: input?.contract_id,
          is_listed: true,
          store_id: process.env.NEXT_PUBLIC_STORE_ID,
        },
        orderBy: {},
      };

      if (input.orderBy) {
        const object: any = input.orderBy.split("-"); //["name","asc"]
        // options.orderBy.OR = [];
        // search by name
        if (object[0] == "name") {
          options.orderBy = [
            {
              name: object[1],
            },
          ];
        } else if (object[0] == "price") {
          options.orderBy = [
            {
              price: object[1],
            },
          ];
        }
      }

      if (input.searchQuery) {
        options.where.OR = [];
        // search by name
        options.where.OR.push({
          name: { contains: input.searchQuery, mode: "insensitive" },
        });
      }
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          where: {
            ...options.where,
          },
          orderBy: options.orderBy,
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
