import React from "react";

import NFTCard from "../NFT/NFTCard";


import { renderNFTImage } from "~/utils/helper";
import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

import { api } from "~/utils/api";
import { useRouter } from "next/router";

const Homepage = () => {
  const router = useRouter();
  const { contract_id } = router.query;

  
  return (
    <div>
      <div className="h-full  min-h-screen w-full bg-bg-1 px-4 pt-8">
        <Banner collection_id={contract_id} />
        <NFTListing />

      </div>
    </div>
  );
};

const Banner = ({ collection_id }:any) => {
  const { data: NFTCollection } = api.storeCollection.getStoreCollection.useQuery(
    {  id: collection_id },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (collection_id !==undefined) {
    return (
      <>
        <div className=" relative h-[150px] sm:h-[200px]  w-full  object-cover  py-4 md:h-[300px] ">
          <Image
            src={renderNFTImage(NFTCollection)}
            alt="/collection banner"
            fill
            quality={100}
            className="rounded-[20px] object-cover px-2 "
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className=" relative h-[150px] sm:h-[200px] w-full  object-cover  py-4 md:h-[300px] ">
          <Image
            src={BannerImage}
            alt="/banner"
            fill
            quality={100}
            className={`rounded-[20px]  object-cover px-2`}
          />
        </div>
      </>
    );
  }
};

export default Homepage;
