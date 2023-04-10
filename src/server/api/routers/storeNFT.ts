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
      //   console.log(ctx, 'ctx');
      // ctx.prisma.
      try {
        const NFTS = await ctx.prisma.storeNft.findMany({
          where: {
            store_id: "642271fe20c73df3d28f4a5e",
            is_listed: true,
            name: {
              mode: "insensitive",
            },
          },
          // orderBy: {
          //   name: "desc",
          // },
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
});
