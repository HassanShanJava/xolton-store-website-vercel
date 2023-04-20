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
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
            visibility: true,

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


  getStoreTheme: publicProcedure
    .input(StoreWebSchema)
    .query(async ({ ctx, input }) => {
      try {
        const website = await ctx.prisma.storeWeb.findFirst({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
          },
          select: {
            theme: true
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

  getStoreDetails: publicProcedure
    .input(StoreWebSchema)
    .query(async ({ ctx, input }) => {
      try {
        const website = await ctx.prisma.storeWeb.findFirst({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
          },
          select: {
            name: true,
            logo_image: true,
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
  getStoreBanner: publicProcedure
    .input(StoreWebSchema)
    .query(async ({ ctx, input }) => {
      try {
        const website = await ctx.prisma.storeWeb.findFirst({
          where: {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
          },
          select: {
            banner_image: true,
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
