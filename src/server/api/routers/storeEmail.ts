import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

import { StoreEmailSchema } from "~/schema/storeEmailSchema";
import { sendLoginEmail } from "~/utils/mailer";

export const storeEmailRouter = router({
  sendEmail: publicProcedure
    .input(StoreEmailSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userData: any = await ctx.prisma.user.findFirst({
          where: {
            id: process.env.NEXT_PUBLIC_STORE_ID,
          },
        });
        if (userData?.email) await sendLoginEmail(userData?.email, input);

        return userData;
      } catch (e) {
        console.log("error:::", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
