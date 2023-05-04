import { type AppType } from "next/app";

import "~/styles/globals.css";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// This gets called on every request
const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
  // const [queryClient] = useState(() => new QueryClient());

  console.log({pageProps})

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
