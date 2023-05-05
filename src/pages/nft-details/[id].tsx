import dynamic from "next/dynamic";
import { websiteInfo } from "~/utils/helper";

const NFTDetails = dynamic(() => import("../../components/NFT/NFTDetail"), {
  ssr: false,
});

export async function getStaticProps() {
  const response: any = await websiteInfo()
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result: any = await response.json();
  
  const navData = result?.data?.navbar || [];
  const webData = result?.data?.website || {};

  return { props: { navData,webData,} };
}

export default function detailPage({navData, webData}:any) {
  return (
    <>
      <NFTDetails  navData={navData} webData={webData} />
    </>
  );
}
