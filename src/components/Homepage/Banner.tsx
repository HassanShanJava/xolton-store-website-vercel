import React from "react";
import BannerImage from "../../public/images/banner.png";
import Image from "next/image";
const Banner = () => {
  return (
    <div className="">
      <Image src={BannerImage} alt="/banner" fill className="object-contain px-8"/>
    </div>
  );
};

export default Banner;
