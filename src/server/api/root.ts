import { router } from "~/server/api/trpc";
import { storeNFTRouter } from "./routers/storeNFT";
import { storeMakerRouter } from "./routers/storeMaker";
import { storeBlogsRouter } from "./routers/storeBlogs";
import { storeNFTOrderRouter } from "./routers/storeNFTOrder";
import { storeCollectionRouter } from "./routers/storeCollection";
import { storeWebRouter } from "./routers/storeWeb";
import { storeEmailRouter } from "./routers/storeEmail";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  clientNFT: storeNFTRouter,
  clientBlogs: storeBlogsRouter,
  clientMaker: storeMakerRouter,
  clientNFTOrder: storeNFTOrderRouter,
  clientCollection: storeCollectionRouter,
  clientWeb: storeWebRouter,
  clientEmail: storeEmailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
