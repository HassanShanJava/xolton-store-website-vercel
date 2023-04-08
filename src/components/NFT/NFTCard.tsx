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
          position: "top-right",
        })
      : "";

    const balance = await web3?.eth.getBalance(account);
    // console.log(balance, "balance");
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    console.log(accountBalance,"accountBalance")
    setAccountBalance(accountBalance);
  };
  return (
    <React.Fragment>
      <div className="px-auto  h-full max-h-[420px] w-full max-w-[290px] rounded-[20px] bg-[#fafafa] p-3 hover:bg-white">
        <Link href={`/nft-details/${nft.id}`}>
          <div className="h-full max-h-[290px] w-full max-w-[290px]">
            <div className="py-auto flex h-full  items-center justify-center object-cover ">
              <Image
                src={renderNFTImage(nft)}
                alt="/nft"
                width={260}
                height={290}
                priority
                className="px-auto h-full max-h-[290px]  w-full max-w-[260px]  rounded-xl object-cover"
              />
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between px-2.5 py-3">
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
        </div>
        {showPop && (
          <Popup
            open={showPop}
            setBuy={setShowPop}
            price={+nft.price}
            tax={+nft.tax}
            accountBalance={+accountBalance}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default NFTCard;
