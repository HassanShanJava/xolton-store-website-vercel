import Image from "next/image";
import React, { useEffect, useState } from "react";

import Popup from "../Ui/Popup";

import { renderNFTImage } from "~/utils/helper";

import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import Web3 from "web3";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";

import Link from "next/link";

const NFTCard = ({ nft }: any) => {
  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");

  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);
  const buyNFT = async () => {
    account == ""
      ? toast({
          title: "Connect Wallet",
          status: "error",
          isClosable: true,
          position: "top-left",
        })
      : account == nft.creator_id
      ? toast({
          title: "Owner cannot buy there own NFT",
          status: "error",
          isClosable: true,
          position: "top-left",
        })
      : setShowPop(true);

    const balance = await web3?.eth.getBalance(account);
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    setAccountBalance(accountBalance);
  };
  return (
    <>
      <div className=" mx-auto h-auto w-full  max-w-[350px]   rounded-[20px] bg-[#fafafa] p-3 hover:bg-white">
        <Link href={`/nft-details/${nft.id}.html`}>
          <div className={" relative h-80 max-h-[290px]  w-full"}>
            <Image
              src={renderNFTImage(nft)}
              alt="/nft"
              fill
              priority
              quality={100}
              className="mx-auto rounded-xl  object-cover "
            />
          </div>
        </Link>

        <div className="">
          <div className="flex items-center justify-between px-2.5 py-4">
            <p className="capitalize">{nft?.name}</p>
            <p>
              {nft?.price} <span className="text-xs lowercase">MATIC</span>
            </p>
          </div>

          <div className="px-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                buyNFT();
              }}
              className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
            >
              Buy
            </button>
            {showPop && (
              <Popup
                nft={nft}
                open={showPop}
                setBuy={setShowPop}
                price={+nft.price}
                tax={+nft.tax}
                accountBalance={+accountBalance}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTCard;
