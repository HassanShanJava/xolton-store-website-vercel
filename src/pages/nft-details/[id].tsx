
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { websiteInfo } from "~/utils/helper";
import { GetServerSideProps, NextPageContext } from "next";



const NFTDetails = dynamic(() => import("../../components/NFT/NFTDetail"), {
  ssr: false,
});

export default function detailPage({navData, webData, query}:any) {
  
console.log(query,"id")
  return (
    <>
      <NFTDetails navData={navData} webData={webData} query={query}/>
    </>
  );
}


detailPage.getIntialProps =async ()=>{
  const res = await websiteInfo();
  const json = await res.json();
  console.log({json},"json")
  return { navData:json.navData, webData:json.webData };
}


