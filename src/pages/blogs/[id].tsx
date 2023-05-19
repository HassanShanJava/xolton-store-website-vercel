import dynamic from "next/dynamic";
import React from "react";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

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

  const responseWeb = await websiteInfo();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  if (!responseWeb.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  const resultWeb: any = await responseWeb.json();
  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};
  return { props: { storeBlogsData: result?.data[0], navData, webData } };
}
const AboutDetailFunc = dynamic(
  () => import("~/components/Blogs/BlogsDetail"),
  {
    ssr: true,
  }
);

export default function BlogsPage({ storeBlogsData, navData, webData }: any) {
  return (
    <>
      <SeoHead
        name={storeBlogsData?.title}
        title={`${storeBlogsData?.title} `}
        description={`${storeBlogsData?.description}`}
        domain_name={storeBlogsData?.meta}
        banner_image={storeBlogsData?.thumb || webData?.banner_image}
        icon={webData?.logo_image}
      />
      <AboutDetailFunc
        storeBlogsData={storeBlogsData}
        navData={navData}
        webData={webData}
      />
    </>
  );
}
