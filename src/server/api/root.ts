import { router } from "~/server/api/trpc";
import { storeNFTRouter } from "./routers/storeNFT";
import { storeMakerRouter } from "./routers/storeMaker";
import { storeBlogsRouter } from "./routers/storeBlogs";
import { storeNFTOrderRouter } from "./routers/storeNFTOrder";
import { storeCollectionRouter } from "./routers/storeCollection";
import { storeWebRouter } from "./routers/storeWeb";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  storeNFT: storeNFTRouter,
  storeBlogs: storeBlogsRouter,
  storeMaker: storeMakerRouter,
  storeNFTOrder: storeNFTOrderRouter,
  storeCollection: storeCollectionRouter,
  storeWeb:storeWebRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
