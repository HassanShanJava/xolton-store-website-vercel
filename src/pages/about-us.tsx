import dynamic from "next/dynamic";
import React from "react";
import SeoHead from "~/components/Layout/SeoHead";
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
  return (
    <>
      <SeoHead
        name={webData?.name}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description="The one-stop NFT platform to turn your creative ideas into a full-blown NFT marketplace. Create your own NFT marketplace today for free."
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
      />
      <AboutFunc navData={navData} webData={webData} />;
    </>
  );
}
