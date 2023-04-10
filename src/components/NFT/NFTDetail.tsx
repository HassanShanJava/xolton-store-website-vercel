import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import {
  renderNFTImage,
  customTruncateHandler,
  maticToUSD,
  // maticToUSD,
} from "~/utils/helper";
import { useSelector } from "react-redux";
import NFTCard from "./NFTCard";

import Popup from "../Ui/Popup";

import { web3Init } from "~/store/slices/web3Slice";
import Web3 from "web3";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";

const NFTDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  const { data: NFTDetail } = api.storeNFT.getNFTDetail.useQuery(
    { id: id },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: NFTCollection } = api.storeNFT.getNFTCollection.useQuery(
    { contract_id: NFTDetail?.contract_id },
    {
      refetchOnWindowFocus: false,
    }
  );

  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [usdMatic, setUsdMatic] = useState<any>("");

  const toast = useToast();

  // console.log(initWeb3,"web3Init")

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

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
    const accountBalance = web3?.utils.fromWei(balance, "ether");

    setAccountBalance(accountBalance);
  };

  useEffect(() => {
    (async () => {
      const maitccprice = await maticToUSD(+NFTDetail?.price);
      // console.log(usdMatic,"usdMatic")
      setUsdMatic(maitccprice);
    })();
  }, [NFTDetail?.price]);

  console.log({ usdMatic });

  return (
    <div>
      {NFTDetail && (
        <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 pt-12 font-inter">
          <div className=" mx-auto flex w-full max-w-7xl flex-col   items-start justify-between md:flex-row">
            <div className="[min-w-[840px]]:mb-0  top-20 mx-auto mb-4 h-full max-h-[500px] w-full max-w-[450px] md:sticky">
              <div className="h-[450px] w-full">
                <Image
                  src={renderNFTImage(NFTDetail)}
                  alt="/nft"
                  width={700}
                  height={500}
                  priority
                  quality={100}
                  className="relative h-full max-h-[500px] w-full  max-w-[680px] rounded-xl object-cover"
                />
              </div>
            </div>

            <div className="mx-auto w-full max-w-xl md:px-4">
              {/* intial details */}
              <p className="text-5xl ">
                {NFTDetail.name}{" "}
                <span className="text-[20px] text-ac-2">
                  #{NFTDetail.token_id}
                </span>
              </p>
              <p className="text-md my-5 max-w-md justify-start text-tx-1">
                {NFTDetail.description}
              </p>

              {/* price and button */}
              <div className="py-3">
                <div className="my-3 flex justify-between">
                  <p>
                    {NFTDetail.price}{" "}
                    <span className="text-xs lowercase text-slate-500">
                      MATIC
                    </span>
                  </p>
                  <p>
                    <span className="text-xs lowercase text-slate-500">$</span>
                    {` ${usdMatic}`}
                  </p>
                </div>
                <div className="mb-3">
                  <button
                    type="button"
                    className="w-full rounded-3xl bg-black p-4 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      buyNFT();
                    }}
                  >
                    BUY
                  </button>
                  {showPop && NFTDetail && (
                    <Popup
                      open={showPop}
                      setBuy={setShowPop}
                      price={+NFTDetail?.price}
                      tax={+NFTDetail?.tax}
                      accountBalance={+accountBalance}
                    />
                  )}
                </div>
              </div>

              {/* nft detail */}
              <div className="py-6">
                <div className=" group rounded-xl border border-tx-2 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-3 font-medium">
                    <span>NFT Detail</span>
                    {/* <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span> */}
                  </summary>
                  {/*divider  */}
                  <div className=" border-t border-tx-2 " />
                  <div className="md:text-md   text-xs text-slate-500  sm:text-sm">
                    <div className="flex justify-between p-3">
                      <p>Contract Address</p>
                      <p>{customTruncateHandler(NFTDetail.contract_address)}</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3  ">
                      <p>Token Standard</p>
                      <p>ERC-20</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3  ">
                      <p>Token ID</p>
                      <p>{NFTDetail.token_id}</p>
                    </div>
                    {/*divider  */}
                    {/* <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3  ">
                      <p>Collection ID</p>
                      <p>{NFTDetail.contract_id}</p>
                    </div> */}
                    {/*divider  */}
                    <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3 ">
                      <p>Blockchain</p>
                      <p>Ethereum</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* collection */}
          <div className="mx-auto h-full min-h-screen w-full max-w-7xl bg-bg-1 px-8 py-6">
            <div className="mx-auto flex items-center justify-between px-4 py-3">
              <p>From the same collection</p>
              <button
                type="button"
                className="border-b border-black p-1"
                onClick={() => {}}
              >
                View More
              </button>
            </div>
            <div className=" grid h-full min-h-screen w-full  grid-cols-1    sx:grid-cols-2  lg:grid-cols-3">
              {NFTCollection &&
                NFTCollection.map((collectionNFT, i) => (
                  <NFTCard nft={collectionNFT} key={i} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;
