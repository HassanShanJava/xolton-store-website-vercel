import { type NextPage } from "next";
import Head from "next/head";
import Homepage from "~/components/Homepage/Homepage";
import Footer from "~/components/Layout/Footer";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

const Home: NextPage = ({ navData, webData, seoData }: any) => {
  // console.log({webData,seoData},"webData, seoData")
  return (
    <>
      <SeoHead
        name={webData?.name}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description={webData.description}
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
        canonical_url={""}
      />
      <main className=" min-h-screen">
        <Homepage webData={webData} navData={navData} />
      </main>
      <Footer webData={webData} />
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const response: any = await websiteInfo();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  const navData = result?.data?.navbar || [];
  const webData = result?.data?.website || {};
  const seoData = result?.data?.seo[0] || {};

  return { props: { navData, webData, seoData } };
}
