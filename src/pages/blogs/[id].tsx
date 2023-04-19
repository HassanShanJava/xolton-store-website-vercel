import dynamic from "next/dynamic";
import React from "react";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
export async function getStaticPaths() {
  const data = await prisma.storeBlogs.findMany({
    where: {
      store_id: process.env.STORE_ID,
    },
  });

  const paths = data?.map((post: any) => ({
    params: { id: post.meta },
  }));

  return { paths, fallback: false };
}
export async function getStaticProps({ params }: any) {
  const storeBlogsData = await prisma.storeBlogs.findFirst({
    where: {
      meta: params?.id,
    },
    select: {
      title: true,
      meta: true,
      data: true,
      thumb: true,
    },
  });
  return { props: { storeBlogsData } };
}
const AboutDetailFunc = dynamic(
  () => import("~/components/Blogs/BlogsDetail"),
  {
    ssr: true,
  }
);

export default function BlogsPage({ storeBlogsData }: any) {
  return <AboutDetailFunc storeBlogsData={storeBlogsData} />;
}
