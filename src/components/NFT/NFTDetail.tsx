import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import {
  renderNFTImage,
  customTruncateHandler,
  maticToUSD,
} from "~/utils/helper";
import { useSelector } from "react-redux";
import NFTCard from "./NFTCard";

import Popup from "../Ui/Popup";

import { web3Init } from "~/store/slices/web3Slice";
import Web3 from "web3";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";
import { trpc } from "~/utils/trpc";
import { useQuery } from "@tanstack/react-query";

const NFTDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  const {
    isLoading,
    isError,
    isFetched,
    data: nftApiDetail,
    error,
  } = useQuery(
    ["nftDetail"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?id=${id}&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const NFTDetail = nftApiDetail?.data[0];

  const { data: NFTCollection } = useQuery(
    ["nftCollection"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?contract_id=${NFTDetail?.contract_id}&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: NFTDetail?.contract_id ? true : false,
    }
  );
  console.log(NFTCollection, "nftApiCollection");

  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [usdMatic, setUsdMatic] = useState<any>("");

  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  // buy nft
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

  // convert matic to usd
  useEffect(() => {
    (async () => {
      if (NFTDetail !== null || NFTDetail !== undefined) {
        try {
          const nftPrice: number = NFTDetail?.price ? +NFTDetail?.price : 0;
          const maitccprice = await maticToUSD(nftPrice);
          // console.log(usdMatic,"usdMatic")
          setUsdMatic(maitccprice);
        } catch (e) {
          console.log(e, "consvertion error front-end");
        }
      }
    })();
  }, [NFTDetail?.price]);

  return (
    <div>
      {NFTDetail && (
        <div className="max-h-full min-h-screen w-full  bg-bg-1 px-2 pt-12 font-storeFont md:px-7">
          <div className=" max-w-6.5xl mx-auto flex w-full flex-col   items-start justify-between md:flex-row">
            <div className="[min-w-[840px]]:mb-0  top-20 mx-auto mb-4 h-full max-h-[500px] w-full max-w-[450px] md:sticky">
              <div className="h-[400px] w-full">
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
                    className="w-full rounded-3xl bg-bg-3 p-4 text-white"
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
                      nft={NFTDetail}
                      setBuy={setShowPop}
                      price={+NFTDetail.price}
                      tax={+NFTDetail.tax}
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
                      <p>ERC-721</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3  ">
                      <p>Token ID</p>
                      <p>{NFTDetail.token_id}</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-2" />
                    <div className="flex justify-between p-3 ">
                      <p>Blockchain</p>
                      <p>Polygon - Matic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* collection */}
          <CollectionList
            contract_id={NFTDetail?.contract_id}
            NFTCollection={NFTCollection?.data}
          />
        </div>
      )}
    </div>
  );
};

const CollectionList: any = ({ contract_id, NFTCollection }: any) => {
  const router = useRouter();
  return (
    NFTCollection?.length != 0 && (
      <div className="mx-auto h-full min-h-screen w-full max-w-7xl  bg-bg-1 py-6 sm:px-10">
        <div className="mx-auto flex items-center justify-between py-3 sm:px-5">
          <p className="md:text-md text-sm lg:text-lg">
            From the same collection
          </p>
          <button
            type="button"
            className="md:text-md rounded-lg border-b border-transparent p-1 px-4 text-sm duration-300 hover:border-black hover:bg-white lg:text-lg "
            onClick={() => {
              router.push(`/?contract_id=${contract_id} `);
            }}
          >
            View More
          </button>
        </div>
        <div className="  grid  h-full w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {NFTCollection &&
            NFTCollection?.map((collectionNFT: any, i: any) => (
              <NFTCard nft={collectionNFT} key={i} />
            ))}
        </div>
      </div>
    )
  );
};

export default NFTDetail;
