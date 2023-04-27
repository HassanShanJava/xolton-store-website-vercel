import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/api/root';

export const trpc = createTRPCReact<AppRouter>();


// import {createTRPCProxyClient, httpBatchLink} from "@trpc/client"
// import type { AppRouter } from '../server/api/root';
// import superjson from "superjson";

// export const trpc = createTRPCProxyClient<AppRouter>({
//     transformer: superjson,
//     links: [
//         httpBatchLink({
//           url: 'https://xoltanmarketplace.com/api/trpc',
          
//           fetch(url, options) {
//             return fetch(url, {
//               ...options,
//               credentials: 'include',
//             });
//           },
//         }),
//       ], 
// });