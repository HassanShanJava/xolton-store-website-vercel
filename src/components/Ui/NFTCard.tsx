import Image from "next/image";
import React from "react";
import NFTImage from "../../public/images/character-1.png";

const NFTCard = ({ nft }) => {
  return (
    <>
      <div className="group mx-auto h-full max-h-[442px] w-full max-w-[295px] rounded-[20px] bg-bg-1 p-3 hover:bg-white">
        <div className=" object-contain ">
          <Image
            src={nft.img_path}
            alt="/nft"
            className="h-full max-h-[333px] w-full max-w-[275px] "
          />
        </div>

        <div className="flex items-center justify-between px-2.5 py-3">
          <p>{nft.nft_name}</p>
          <p>{nft.eth}</p>
        </div>

        <div className="px-2">
          <button
            type="button"
            className="text-white` w-full rounded-[6px] bg-black py-3 text-center text-white group-hover:bg-accentLinear-1 "
          >
            Buy
          </button>
        </div>
      </div>
    </>
  );
};

export default NFTCard;
