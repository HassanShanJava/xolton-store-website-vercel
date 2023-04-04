import React from "react";
import Banner from "./Banner";
import NFTCard from "../Ui/NFTCard";

import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "./NFTListing";


const Homepage = () => {
  return (
    <div className="max-h-full min-h-screen w-full  bg-pm-11 px-8">
      <div className=" relative w-full h-[400px] ">
        {/* <Banner /> */}
        <Image src={BannerImage} alt="/banner" fill objectFit="cover" className="rounded-[20px]  py-4"/>
      </div>

      <div className=" py-6 sm:py-4 w-full">
        {/* <NFTCard /> */}
        <NFTListing/>
      </div>
    </div>
  );
};

export default Homepage;
