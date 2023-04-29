import { type AppType } from "next/app";

import "~/styles/globals.css";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "~/utils/trpc";
import superjson from "superjson";
// import { httpRequest } from "@trpc/client/dist/links/internals/httpUtils";
// This gets called on every request

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
