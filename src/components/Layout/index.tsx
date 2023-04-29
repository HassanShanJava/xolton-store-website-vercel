// "use server";
import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";
import { api } from "~/utils/api";
import { renderNFTIcon } from "~/utils/helper";
import { trpc } from "~/utils/trpc";
import { useQuery } from "@tanstack/react-query";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: details, isFetched } = useQuery(
    ["nftNavbar"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {isFetched && (
        <Provider store={store}>
          <Head>
            <title>{details && details?.data?.website?.name}</title>
            <meta
              property="og:title"
              content={`${details && details?.data?.website?.name}`}
              key="title"
            />
            <meta
              name="description"
              content={`${details && details?.data?.website?.name} Store`}
            />
            <link rel="icon" href={renderNFTIcon(details?.data?.website)} />
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

export default Layout;
