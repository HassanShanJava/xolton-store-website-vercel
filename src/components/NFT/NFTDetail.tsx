import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import { renderNFTImage, customTruncateHandler } from "~/utils/helper";
import { useSelector } from "react-redux";
import NFTCard from "./NFTCard";

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

  // if (NFTDetail) {
  // }

  console.log(NFTDetail, "NFTDetail");
  console.log(NFTCollection, "collectionContract");

  // const { web3 } = useSelector((state: any) => state.web3);

  // const price=NFTDetail?.price
  // const usdPrice=web3?.utils.fromWei(Number(price), "usd");
  // console.log(usdPrice,"usdPrice")
  return (
    <>
      {NFTDetail && (
        <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 pt-12 font-inter">
          <div className="relative mx-auto flex w-full max-w-6xl flex-col   items-start justify-between md:flex-row">
            <div className=" [min-w-[840px]]:mb-0 mx-auto mb-4 h-full max-h-[500] w-full max-w-[450px]">
              <Image
                src={renderNFTImage(NFTDetail)}
                alt="/nft"
                width={500}
                height={500}
                quality={100}
                className="h-full max-h-[500px] w-full  max-w-[450px] rounded-xl object-cover"
              />
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
                  <p>{NFTDetail.price}</p>
                </div>
                <div className="mb-3">
                  <button
                    type="button"
                    className="w-full rounded-3xl bg-black p-4 text-white"
                  >
                    BUY
                  </button>
                </div>
              </div>

              {/* nft detail */}
              <div className="py-6">
                <div className="y-3 rounded-xl border border-tx-1 bg-white">
                  <p className="p-3 text-lg">NFT Detail</p>
                  {/*divider  */}
                  <div className=" border-t border-slate-500" />
                  <div className="md:text-md text-xs text-slate-500 sm:text-sm  ">
                    <div className="flex justify-between p-3">
                      <p>Contract Address</p>
                      <p>{customTruncateHandler(NFTDetail.contract_address)}</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-1" />
                    <div className="flex justify-between p-3  ">
                      <p>Token Standard</p>
                      <p>ERC-20</p>
                    </div>
                    {/*divider  */}
                    <div className=" border-t border-tx-1" />
                    <div className="flex justify-between p-3  ">
                      <p>Token ID</p>
                      <p>{NFTDetail.token_id}</p>
                    </div>
                    {/*divider  */}
                    {/* <div className=" border-t border-tx-1" />
                    <div className="flex justify-between p-3  ">
                      <p>Collection ID</p>
                      <p>{NFTDetail.contract_id}</p>
                    </div> */}
                    {/*divider  */}
                    <div className=" border-t border-tx-1" />
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
          <div className="max-h-6xl mx-auto h-full w-full max-w-6xl px-8 py-6">
            <div className="flex justify-between items-center py-3 mx-auto px-4"> 
              <p>From the same collection</p>
              <button type="button" className="border-b p-1 border-black">View More</button>
            </div>
            <div className="grid h-full w-full  grid-cols-1 px-4 gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {NFTCollection &&
                NFTCollection.map((collectionNFT, i) => (
                  <NFTCard nft={collectionNFT} key={i} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTDetail;
