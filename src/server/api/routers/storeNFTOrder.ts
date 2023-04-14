import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreOrderNFTSchema } from "~/schema/storeNFTSchema";

export const storeNFTOrderRouter = router({
  updateStoreNFTOrder: publicProcedure
    .input(StoreOrderNFTSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input, "nft order create");
        const data :any= input
        
        const order= await ctx.prisma.storeNftOrder.create({data})
        console.log(order,"order")
        return order
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
