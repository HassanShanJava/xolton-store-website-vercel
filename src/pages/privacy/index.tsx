import dynamic from "next/dynamic";
import React from "react";
import Footer from "~/components/Layout/Footer";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

export async function getStaticProps() {
  const response: any = await websiteInfo();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  const navData = result?.data?.navbar || [];
  const webData = result?.data?.website || {};

  return { props: { navData, webData } };
}
const PrivacyFunc = dynamic(
  () => import("~/components/Privacy/PrivacyPolicy"),
  {
    ssr: true,
  }
);
export default function FaqPage({ navData, webData }: any) {
  return (
    <div className="bg-bg-1">
      <SeoHead
        name={`Privacy | ${webData?.name}`}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description={webData.description}
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
        canonical_url={"privacy"}
      />
      <div className="mx-auto max-w-[1600px]">
        <PrivacyFunc navData={navData} webData={webData} />;
      </div>
      <Footer webData={webData}/>
    </div>
  );
}
