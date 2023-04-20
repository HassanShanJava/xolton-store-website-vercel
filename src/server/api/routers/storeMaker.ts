import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreMakerSchema } from "~/schema/storeMakerSchema";

export const storeMakerRouter = router({
  getStoreMaker: publicProcedure
    .input(StoreMakerSchema)
    .query(async ({ ctx}) => {
      
      try {
        const makerOrder = await ctx.prisma.storeMakerOrder.findMany({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
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
