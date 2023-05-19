
import dynamic from "next/dynamic";
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

  const paths = result?.data?.map((post: any) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: false };
}
export async function getStaticProps({ params }: any) {
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
  if (!responseWeb.ok) {
    throw new Error("Network response was not ok");
  }

  const result: any = await response.json();

  const resultWeb: any = await responseWeb.json();
  const navData = resultWeb?.data?.navbar || [];
  const webData = resultWeb?.data?.website || {};
  return { props: { storeBlogsData: result?.data[0], navData, webData } };
}

export default function detailPage({navData, webData}:any) {
  
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
      <NFTDetails navData={navData} webData={webData} />
    </>
  );
}



