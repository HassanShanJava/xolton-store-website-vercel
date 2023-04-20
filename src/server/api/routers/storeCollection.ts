import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreCollectionSchema } from "~/schema/storeCollectionSchema";


export const storeCollectionRouter = router({
  getStoreCollection: publicProcedure
    .input(StoreCollectionSchema)
    .query(async ({ ctx, input }) => {
      try {
        if(input.id!=undefined){
          const collection = await ctx.prisma.storeCollection.findFirst({
            where: {
              id: input.id,
            },
            
          });
  
          console.log(collection, "collection");
          return collection;
        }else{
          return false 
        }
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
