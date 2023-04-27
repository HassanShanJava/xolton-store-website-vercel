import { type AppType } from "next/app";


import "~/styles/globals.css";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import superjson from "superjson";
import { httpRequest } from "@trpc/client/dist/links/internals/httpUtils";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `http://192.168.10.75:3000/api/trpc`,
          fetch(url, options) {
            console.log({ options }, "options");
            
            const { promise, cancel } = httpRequest({
              options,
              
            });
    
            
            
            return{
              promise: fetch(url, {
                ...options,
                mode: "no-cors",
              }).then((head: any, res: any) => res).then((resJSON: any) => {
                    console.log("response", resJSON);
        
                    const result = resJSON.map((item : any) => ({
                      meta: {},
                      json: item,
                    }));
        
                    return result;
                  }),
                cancel: (res) => console.log(res)
            } ;
          },
          headers() {
            return {
              mode: "no-cors",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default MyApp;
