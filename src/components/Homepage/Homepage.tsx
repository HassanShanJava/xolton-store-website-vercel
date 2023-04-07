import React from "react";
import Banner from "./Banner";
import NFTCard from "../NFT/NFTCard";

import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

const Homepage = () => {
  return (
    <>
      <div className="h-full max-h-full w-full  bg-pm-11 px-8 pt-8">
          <div className=" relative py-4 h-[300px] w-full object-cover ">
            {/* <Banner /> */}
            <Image
              src={BannerImage}
              alt="/banner"
              fill
              className=" rounded-[20px] object-cover "
            />
          </div>
        

        <div className=" pt-10 pb-20  h-full min-h-screen w-full ">
          {/* <NFTCard /> */}
          <NFTListing />
        </div>
      </div>
    </>
  );
};

export default Homepage;
