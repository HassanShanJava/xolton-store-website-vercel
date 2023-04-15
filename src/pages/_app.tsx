import { type AppType } from "next/app";

import "~/styles/globals.css";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "~/utils/api";


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
