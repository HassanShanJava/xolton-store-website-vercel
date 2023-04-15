import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreNFTSchema } from "~/schema/storeNFTSchema";
import { prisma } from "~/server/db";
import { BlogsDeleteSchema } from "~/schema/storeBlogsSchema";

export const storeBlogsRouter = router({
  getStoreBlogs: publicProcedure
    .input(StoreNFTSchema)
    .query(async ({ ctx, input }) => {
      //   console.log(ctx, 'ctx');
      // ctx.prisma.
      try {
        const blogs = await ctx.prisma.storeBlogs.findMany({
          orderBy: { created_at: "desc" },

          where: {
            store_id: "642271fe20c73df3d28f4a5e",
          },
        });

        console.log(blogs, "BLOGS");
        return blogs;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getStoreBlogsById: publicProcedure
    .input(BlogsDeleteSchema)
    .query(async ({ ctx, input }) => {
      console.log("data for check", input);

      try {
        // upload IPFS DATA
        const exists: any = await ctx.prisma.storeBlogs.findFirst({
          where: {
            id: input?.id,
            store_id: "642271fe20c73df3d28f4a5e",
          },
        });
        return exists;
      } catch (error: any) {
        console.log({ error }, "error");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),
});
