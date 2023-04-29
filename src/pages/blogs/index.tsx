import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";

import { prisma } from "~/server/db";
import { QueryClient, useQuery } from "@tanstack/react-query";

export async function getStaticProps() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result: any = await response.json();

  const storeBlogsData = result?.data;
  // const storeBlogsData = await prisma.storeBlogs.findMany({
  //   where: {
  //     store_id: process.env.NEXT_PUBLIC_STORE_ID,
  //   },
  // });
  // storeBlogsData.forEach((listing: any) => {
  //   Object.entries(listing).forEach(([key, prop]) => {
  //     if (prop instanceof Date) {
  //       listing[key] = prop.toString();
  //     }
  //   });
  // });

  return { props: { storeBlogsData } };
}

const BlogFunc = dynamic(() => import("~/components/Blogs/BlogsListing"), {
  ssr: true,
});
export default function BlogsPage({ storeBlogsData }: any) {
  return <BlogFunc storeBlogsData={storeBlogsData} />;
}
