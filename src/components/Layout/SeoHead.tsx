import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";

import { renderNFTIcon, websiteInfo } from "~/utils/helper";

const SeoHead = ({ ...props }: any) => {
  // use context

  return (
    <Head>
      {props?.domain_name && (
        <link
          rel="canonical"
          href={`https://${props?.domain_name}.${process.env.NEXT_PUBLIC_LIVE_URL}/${props?.canonical_url}`}
        />
      )}
      {props?.name && <title>{props?.name}</title>}
      {props?.title && (
        <meta property="og:title" content={props?.title} key="title" />
      )}
      {props?.title && <meta property="og:title" content={props?.title} />}
      <meta name="robots" content="noindex,nofollow" />
      {props?.description && (
        <meta name="description" content={`${props?.description} Store`} />
      )}
      {props?.domain_name && (
        <meta
          property="og:site_name"
          content={`${props?.domain_name} Store`}
        ></meta>
      )}
      {props?.description && (
        <meta name="og:description" content={props?.description}></meta>
      )}
      {props?.banner_image && (
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.banner_image}`}
        ></meta>
      )}
      <meta property="og:image:height" content="1260" />
      <meta property="og:image:width" content="2400" />
      <meta property="og:title" content="Xoltan Marketplace" />
      {props?.domain_name && (
        <meta property="og:url" content={`${props?.domain_name}`}></meta>
      )}
      <meta property="og:type" content="website"></meta>
      {props?.domain_name && props?.name && (
        <meta
          name="keywords"
          content={`${props?.domain_name}, ${props?.name} xoltan, nft, nft marketplace`}
        ></meta>
      )}
      <meta property="og:site_name" content="Xoltan Marketplace" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@AlchemyPlatform" />
      {props?.description && (
        <meta name="twitter:description" content={`${props?.description}`} />
      )}
      {props?.description && (
        <meta name="twitter:title" content={`${props?.name} title`} />
      )}
      {props?.banner_image && (
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.banner_image}`}
        />
      )}
      {props?.icon && (
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.icon}`}
        />
      )}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
        integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </Head>
  );
};

// This gets called on every request

export default SeoHead;
