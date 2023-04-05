import React from "react";
import Banner from "./Banner";
import NFTCard from "../Ui/NFTCard";

import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "./NFTListing";

import { api } from "~/utils/api";

const Homepage = () => {
  const { data: storeMakerData } = api.storeMaker.getStoreMaker.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(storeMakerData, "storeMakerData");
  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-pm-11 px-8">
        <div className=" relative h-[400px] w-full ">
          {/* <Banner /> */}
          <Image
            src={BannerImage}
            alt="/banner"
            fill
            objectFit="cover"
            className="rounded-[20px]  py-4"
          />
        </div>

        <div className=" w-full py-6 sm:py-4">
          {/* <NFTCard /> */}
          <NFTListing />
        </div>
      </div>
    </>
  );
};

export default Homepage;
