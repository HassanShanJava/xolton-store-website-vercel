import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";
import { api } from "~/utils/api";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: details, isFetched } = api.storeWeb.getStoreDetails.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {isFetched && (
        <Provider store={store}>
          <Head>
            <title>{details&&(details.name)}</title>
          </Head>

          <div>
            <Navbar />
            <main>{children}</main>
          </div>
        </Provider>
      )}
    </>
  );
};

export default Layout;
