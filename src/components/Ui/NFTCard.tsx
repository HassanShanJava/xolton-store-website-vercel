import Image from "next/image";
import React, { useEffect, useState } from "react";
import NFTImage from "../../public/images/character-1.png";
import Popup from "./Popup";

import { renderNFTImage } from "~/utils/helper";

import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";

const NFTCard = ({ nft, key }: any) => {
  const [buy, setBuy] = useState(false);
  const handleBuy = () => setBuy(true);
  const toast = useToast();

  console.log(nft, "nft");

  const { account } = useSelector((state: RootState) => state.web3);
console.log(account,"account")
  const [isConnected, setConnect] = useState(
    account && account != "" ? true : false
  );

  return (
    <>
      <div className="mx-auto h-full  max-h-[420px] w-full max-w-[290px] rounded-[20px] bg-bg-1 p-3 hover:bg-white">
        <div className="my-auto flex h-[60%] items-center justify-center object-contain sx:h-[60%] md:h-[70%]">
          <Image
            src={renderNFTImage(nft)}
            alt="/nft"
            width={260}
            height={290}
            className="mx-auto h-full max-h-[290px]  w-full max-w-[260px]  rounded-xl object-cover"
          />
        </div>

        <div className="flex items-center justify-between px-2.5 py-3">
          <p>{nft?.name}</p>
          <p>{nft?.price} Eth</p>
        </div>

        <div className="px-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleBuy();
            }}
            className="text-white` w-full rounded-[6px] bg-black py-3 text-center text-white hover:bg-accentLinear-1 "
          >
            Buy
          </button>
          {buy && account !="" ? (
            <Popup open={buy} setBuy={setBuy} price={nft.price} tax={nft.tax} />
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};

export default NFTCard;
