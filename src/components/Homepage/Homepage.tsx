import React from "react";
import Banner from "./Banner";
import NFTCard from "../NFT/NFTCard";

import Image from "next/image";
import BannerImage from "../../public/images/banner.png";
import NFTListing from "../NFT/NFTListing";

const Homepage = () => {
  return (
    <div>
      <div className="h-full  w-full min-h-screen bg-bg-1 px-4 pt-8">
          <div className=" relative py-4  h-[200px]  md:h-[300px]  w-full object-cover ">
            {/* <Banner /> */}
            <Image
              src={BannerImage}
              alt="/banner"
              fill
              quality={100}
              className="px-2 rounded-[20px] object-cover "
            />
          </div>
        

          <NFTListing />
        {/* <div className=" mt-10 mb-20  h-full min-h-screen w-full ">
        </div> */}
          {/* <NFTCard /> */}
      </div>
    </div>
  );
};

export default Homepage;
