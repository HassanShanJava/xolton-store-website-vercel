import dynamic from "next/dynamic";
import React from "react";

export async function getStaticPaths() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result: any = await response.json();

  const paths = result?.data?.map((post: any) => ({
    params: { id: post.meta },
  }));

  return { paths, fallback: false };
}
export async function getStaticProps({ params }: any) {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&meta=${params?.id}`,
    {
      headers: {
        "Content-Type": "application/json",
        referer: "xoltanmarketplace.com",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result: any = await response.json();

  return { props: { storeBlogsData: result?.data[0] } };
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
