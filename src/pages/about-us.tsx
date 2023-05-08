import dynamic from "next/dynamic";
import React from "react";
import { websiteInfo } from "~/utils/helper";

export async function getStaticProps() {
  const responseWeb: any = await websiteInfo();

  if (!responseWeb.ok) {
    throw new Error("Network response was not ok");
  }
  const resultWeb: any = await responseWeb.json();

  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};

  return { props: { navData, webData } };
}
const AboutFunc = dynamic(() => import("../components/About/AboutUs"), {
  ssr: true,
});

export default function AboutPage({ navData, webData }: any) {
  return <AboutFunc navData={navData} webData={webData} />;
}
