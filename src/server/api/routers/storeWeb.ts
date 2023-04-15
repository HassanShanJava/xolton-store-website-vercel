import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreWebSchema } from "~/schema/storeWeb";

export const storeWebRouter = router({
  getStoreNavbar: publicProcedure
    .input(StoreWebSchema)
    .query(async ({ ctx, input }) => {
      try {
        const navbar = await ctx.prisma.storeWebPages.findMany({
          where: {
            store_id: "642eabca10d4d3ccb791b494",
            visibility:true,
            
          }
        })
        return navbar
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),


  getStoreTheme:  publicProcedure
  .input(StoreWebSchema)
  .query(async ({ ctx, input }) => {
    try {
      const website = await ctx.prisma.storeWeb.findFirst({
        where: {
          store_id: "642eabca10d4d3ccb791b494",          
        },
        select:{
          theme:true
        }
      })
      return website
    } catch (e) {
      console.log("error:::", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }), 
});
