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

const NFTCard = ({ nft, key }: any) => {
  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");

  const toast = useToast();

  // console.log(initWeb3,"web3Init")

  console.log(nft, "nft");

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);
  console.log(account, "account");
  // const [isConnected, setConnect] = useState(
  //   account && account != "" ? true : false
  // );

  // console.log(web3.MATIC.getBalance())

  const buyNFT = async () => {
    account != ""
      ? setShowPop(true)
      : account == ""
      ? toast({
          title: "Connect Wallet",
          status: "error",
          isClosable: true,
          position: "top-left",
        })
      : "";

    const balance = await web3?.eth.getBalance(account);
    // console.log(balance, "balance");
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    console.log(accountBalance, "accountBalance");
    setAccountBalance(accountBalance);
  };
  return (
    <>
      <div className=" mx-auto w-72 h-auto rounded-[20px] bg-[#fafafa] p-3 hover:bg-white">
        <Link href={`/nft-details/${nft.id}`}>
          <div className="relative h-80 max-h-[290px]  w-full  ">
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
            <p>{nft?.name}</p>
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
              className="  w-full rounded-[6px] bg-black py-3 text-center text-white hover:bg-accentLinear-1 "
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
