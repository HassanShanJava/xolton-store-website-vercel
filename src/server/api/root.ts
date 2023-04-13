import { router } from "~/server/api/trpc";
import { storeNFTRouter } from "./routers/storeNFT";
import { storeMakerRouter } from "./routers/storeMaker";
import { storeNFTOrderRouter } from "./routers/storeNFTOrder";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  storeNFT: storeNFTRouter,
  storeMaker:storeMakerRouter,
  storeNFTOrder:storeNFTOrderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
