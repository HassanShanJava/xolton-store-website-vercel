import dynamic from "next/dynamic";
import Footer from "~/components/Layout/Footer";
import SeoHead from "~/components/Layout/SeoHead";
import { websiteInfo } from "~/utils/helper";

const NFTDetails = dynamic(() => import("../../components/NFT/NFTDetail"), {
  ssr: true,
});

export async function getStaticPaths() {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/nft?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&rows=50`,
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
  // console.log(result.data)

  const paths = result?.data?.map((post: any) => ({
    params: { id: post?._id['$oid'] },
  }));

  return { paths, fallback: false };
}
export async function getStaticProps({ params }: any) {
  // console.log(params?.id,'params?.id')
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/nft?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&id=${params?.id}`,
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
  if (!responseWeb?.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  // console.log(result,"result")

  const resultWeb: any = await responseWeb.json();
  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};
  return { props: { storeBlogsData: result?.data[0], navData, webData } };
}

export default function detailPage({ navData, webData, storeBlogsData }: any) {
  return (
    <>
      <SeoHead
        name={`NFT Detail | ${webData?.name}`}
        title={`The No.1 NFT Marketplace Solution - ${webData?.name} `}
        description={webData.description}
        domain_name={webData?.domain_name}
        banner_image={webData?.banner_image}
        icon={webData?.logo_image}
      />
      <NFTDetails
        navData={navData}
        webData={webData}
        NFTDetail={storeBlogsData}
      />
      <Footer webData={webData}/>
    </>
  );
}
