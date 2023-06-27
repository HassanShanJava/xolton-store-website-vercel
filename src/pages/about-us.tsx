import dynamic from "next/dynamic";
import React from "react";
import Footer from "~/components/Layout/Footer";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

export async function getStaticProps() {
  const responseWeb: any = await websiteInfo();

  if (!responseWeb?.ok) {
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
        name={`About Us | ${webData?.name}`}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description={webData.description}
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
        canonical_url={"about-us"}

      />
      <AboutFunc navData={navData} webData={webData} />
      <Footer webData={webData}/>
    </>
  );
}
