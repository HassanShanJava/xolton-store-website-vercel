import dynamic from "next/dynamic";
import React from "react";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { websiteInfo } from "~/utils/helper";

export async function getStaticProps() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );

  const responseWeb = await websiteInfo();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  if (!responseWeb.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();
  const storeBlogsData = result?.data;

  const resultWeb: any = await responseWeb.json();
  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};

  return { props: { storeBlogsData, navData, webData } };
}

const BlogFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: true,
});
export default function BlogsPage({ storeBlogsData, navData, webData }: any) {
  return (
    <BlogFunc
      storeBlogsData={storeBlogsData}
      navData={navData}
      webData={webData}
    />
  );
}
