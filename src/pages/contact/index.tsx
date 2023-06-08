import dynamic from "next/dynamic";
import React from "react";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

const ContactFunc = dynamic(() => import("~/components/Contact/ContactUs"), {
  ssr: true,
});


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


export default function FaqPage({navData, webData}:any) {
  return (
    <>
      <SeoHead
        name={`Contact Support | ${webData?.name}`}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description="The one-stop NFT platform to turn your creative ideas into a full-blown NFT marketplace. Create your own NFT marketplace today for free."
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
        canonical_url={"contact"}

      />
      <ContactFunc navData={navData} webData={webData} />;
    </>
  );
}
