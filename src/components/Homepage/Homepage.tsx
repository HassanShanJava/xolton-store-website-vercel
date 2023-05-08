import React from "react";

import NFTCard from "../NFT/NFTCard";

import { renderBanner, renderNFTIcon, renderNFTImage } from "~/utils/helper";
import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

const Homepage = ({webData}:any) => {
  const router = useRouter();
  const { contract_id } = router.query;

  return (
    <div className="bg-bg-1">
      <div className="h-full max-w-[1800px] mx-auto min-h-screen w-full px-4 py-8">
        <Banner collection_id={contract_id} webData={webData} />
        <NFTListing contract_id={contract_id} />
      </div>
    </div>
  );
};

const Banner = ({ collection_id ,webData}: any) => {
  // calling for collection banner
  const { data: NFTCollection, isFetched } = useQuery(
    ["nftCollectionBanner"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collection?store_id=${process.env.NEXT_PUBLIC_STORE_ID}&id=${collection_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: collection_id ? true : false,
    }
  );

  

  if (collection_id !== undefined) {
    return (
      <>
        <div className=" relative h-[150px] w-full  object-cover  py-2  sm:h-[250px] md:h-[350px] xl:h-[400px] 2xl:h-[450px]">
          <Image
            src={renderNFTImage(NFTCollection?.data)}
            alt="/collection banner"
            fill
            quality={100}
            priority
            className="rounded-[20px] object-cover "
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className=" relative h-[150px] w-full object-cover  py-2  sm:h-[200px] md:h-[350px] xl:h-[400px] 2xl:h-[450px] ">
          <Image
            src={renderBanner(webData)}
            alt="/banner"
            fill
            priority
            quality={100}
            className={`rounded-[20px]  object-cover `}
          />
        </div>
      </>
    );
  }
};

export default Homepage;
