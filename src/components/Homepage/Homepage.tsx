import React from "react";

import NFTCard from "../NFT/NFTCard";


import { renderBanner, renderNFTIcon, renderNFTImage } from "~/utils/helper";
import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

import { api } from "~/utils/api";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";

const Homepage = () => {

  // const { data: storeWeb } = api.website.get.useQuery(
  //   { store_id: user?.id as string },
  //   { enabled: user?.id ? true : false, refetchOnWindowFocus: false },
  // );


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

const Banner = ({ collection_id }:any) => {
  const { data: NFTCollection } = trpc.clientCollection.getStoreCollection.useQuery(
    {  id: collection_id , store_id:process.env.NEXT_PUBLIC_STORE_ID},
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log(NFTCollection,'NFTCollection:::')

  if (collection_id !==undefined) {
    return (
      <>
        <div className=" relative h-[150px] sm:h-[250px]  w-full  object-cover  py-2 md:h-[500px] xl:h-[400px] 2xl:h-[450px]">
          <Image
            src={renderNFTImage(NFTCollection)}
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

    const { data: details, isFetched } = trpc.clientWeb.getStoreBanner.useQuery(
      {store_id:process.env.NEXT_PUBLIC_STORE_ID},
      {
        refetchOnWindowFocus: false,
      }
    );    

    return (
      <>
        <div className=" relative h-[150px] sm:h-[200px] w-full  object-cover  py-2 md:h-[350px] xl:h-[400px] 2xl:h-[450px] ">
          <Image
            src={renderBanner(details)}
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
