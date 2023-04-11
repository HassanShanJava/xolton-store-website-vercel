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
            store_id: "642271fe20c73df3d28f4a5e",
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
