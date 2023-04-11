import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import {
  StoreNFTSchema,
  StoreNFTDetailSchema,
  StoreNFTCollectionSchema,
} from "~/schema/storeNFTSchema";
import { prisma } from "~/server/db";

export const storeNFTRouter = router({
  getStoreNFTS: publicProcedure
    .input(StoreNFTSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input");
      const options: any = {
        where: { is_listed: true },
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
            store_id: "642271fe20c73df3d28f4a5e",
            is_listed: true,
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

  getNFTDetail: publicProcedure
    .input(StoreNFTDetailSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input");

      try {
        const NFTS = await ctx.prisma.storeNft.findFirst({
          where: {
            id: input.id,
            is_listed: true,
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
            contract_id: input.contract_id,
            is_listed: true,
          },

          take: 6,
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

  getNFTHomeCollection: publicProcedure
    .input(StoreNFTCollectionSchema)
    .query(async ({ ctx, input }) => {
      console.log(input, "input jhome collection");

      const options: any = {
        where: { contract_id: input?.contract_id, is_listed: true },
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
