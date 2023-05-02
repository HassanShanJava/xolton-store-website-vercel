import React from "react";

import NFTCard from "../NFT/NFTCard";

import { renderBanner, renderNFTIcon, renderNFTImage } from "~/utils/helper";
import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

const Homepage = () => {
  const router = useRouter();
  const { contract_id } = router.query;

  return (
    <div>
      <div className="h-full  min-h-screen w-full bg-bg-1 px-4 pt-4">
        <Banner collection_id={contract_id} />
        <NFTListing />
      </div>
    </div>
  );
};

const Banner = ({ collection_id }: any) => {
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
  const { data: details } = useQuery(
    ["nftNavbarData"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (collection_id !== undefined) {
    return (
      <>
        <div className=" relative h-[150px] w-full  object-cover  py-2  sm:h-[250px] md:h-[500px] xl:h-[400px] 2xl:h-[450px]">
          <Image
            src={renderNFTImage(NFTCollection?.data)}
            alt="/collection banner"
            fill
            quality={100}
            priority
            className="rounded-[20px] object-cover px-2 "
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className=" relative h-[150px] w-full object-cover  py-2  sm:h-[200px] md:h-[350px] xl:h-[400px] 2xl:h-[450px] ">
          <Image
            src={renderBanner(details?.data?.website)}
            alt="/banner"
            fill
            priority
            quality={100}
            className={`rounded-[20px]  object-cover px-2`}
          />
        </div>
      </>
    );
  }
};

export default Homepage;
