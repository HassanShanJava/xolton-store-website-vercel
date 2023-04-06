import React from "react";
import Banner from "./Banner";
import NFTCard from "../Ui/NFTCard";

import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "./NFTListing";


const Homepage = () => {
  
  return (
    <>
      <div className="max-h-full h-full w-full  bg-pm-11 px-8">
        <div className=" relative h-[350px] w-full rounded-[20px]">
          {/* <Banner /> */}
          <Image
            src={BannerImage}
            alt="/banner"
            fill
            className=" py-4"
          />
        </div>

        <div className=" w-full h-full py-6 sm:py-4">
          {/* <NFTCard /> */}
          <NFTListing />
        </div>
      </div>
    </>
  )
};

export default Homepage;
