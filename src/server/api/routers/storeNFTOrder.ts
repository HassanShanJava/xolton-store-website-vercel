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
        // const order= await ctx.prisma.storeNftOrder.create({data:{
          
        //   store_id: input.store_id,
        //   nft_id: input.nft_id,
        //   nft_name: 'zod',
        //   amount: 922,
        //   sell_type: 'data',
        //   transaction_id: 'aaa',
        //   previous_owner_address: 'sss',
        //   owner_address: 'sahjsahksda',
        //   is_deleted: false,
        // }})
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
