import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreNFTSchema } from "~/schema/storeNFTSchema";
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
            NOT:{
              status:"purchase"
            }
            
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
});
