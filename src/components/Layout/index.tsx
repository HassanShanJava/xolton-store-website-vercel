// "use server";
import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";
import { api } from "~/utils/api";
import { renderNFTIcon } from "~/utils/helper";

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
            <title>{details && details.name}</title>
            <meta
              property="og:title"
              content={`${details && details.name}`}
              key="title"
            />
            <meta
              name="description"
              content={`${details && details.name} Store`}
            />
            <link rel="icon" href={renderNFTIcon(details)} />
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

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const { data: details, isFetched } = api.storeWeb.getStoreDetails.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );
  // Pass data to the page via props
  return { props: { details, isFetched } };
}

export default Layout;
