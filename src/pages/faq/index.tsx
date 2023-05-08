import dynamic from "next/dynamic";
import React from "react";
import { websiteInfo } from "~/utils/helper";

export async function getStaticProps() {
  const response: any = await websiteInfo()
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result: any = await response.json();
  
  const navData = result?.data?.navbar || [];
  const webData = result?.data?.website || {};

  return { props: { navData,webData } };
}
const FaqFunc = dynamic(() => import("~/components/Faq/Faqs"), {
  ssr: true,
});
export default function FaqPage({ navData, webData }: any) {
  return <FaqFunc navData={navData} webData={webData} />;
}
