import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
