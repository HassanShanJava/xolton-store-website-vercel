import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";

import { renderNFTIcon, websiteInfo } from "~/utils/helper";

const Layout = ({ children, ...props }: any) => {
  // use context

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>{props?.webData?.name}</title>
          <meta
            property="og:title"
            content={`${props?.webData?.name}`}
            key="title"
          />
          <meta name="description" content={`${props?.webData?.name} Store`} />
          <meta
            property="og:title"
            content={`The No.1 NFT Marketplace Solution - ${props?.webData?.name} `}
          />
          <meta
            property="og:site_name"
            content={`${props?.webData?.domain_name} Store`}
          ></meta>
          <meta
            name="og:description"
            content="The one-stop NFT platform to turn your creative ideas into a full-blown NFT marketplace. Create your own NFT marketplace today for free."
          ></meta>
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.webData?.banner_image}`}
          ></meta>
          <meta
            property="og:url"
            content={`${props?.webData?.domain_name}`}
          ></meta>
          <meta property="og:type" content="website"></meta>
          <meta
            name="keywords"
            content={`${props?.webData?.domain_name} xoltan, nft, nft marketplace`}
          ></meta>
          <meta property="og:image:type" content="image/png"></meta>
          <meta property="og:image:width" content="1200"></meta>
          <meta property="og:image:height" content="628"></meta>
          <link rel="icon" href={renderNFTIcon(props?.webData)} />
        </Head>

        <div>
          <Navbar navData={props?.navData} webData={props?.webData} />

          <main>{children}</main>
        </div>
      </Provider>
    </>
  );
};

// This gets called on every request

export default Layout;
