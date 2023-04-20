import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

const NFTListing = () => {
  const router = useRouter();
  const { contract_id } = router.query;
  const [sortFilter, setSortFilter] = useState({});

  function handleKeyPress(e: any) {
    if (contract_id == undefined) {
      setTimeout(() => {
        setSortFilter((prevFilters) => ({
          ...prevFilters,
          searchQuery: e.target.value,
        }));
      }, 800);
    } else {
      setTimeout(() => {
        setSortFilter((prevFilters) => ({
          ...prevFilters,
          searchQuery: e.target.value,
          contract_id: contract_id,
        }));
      }, 400);
    }
  }

  const sorNFT = (value: string) => {
    console.log({ value }, "value");
    setSortFilter((prevFilters) => ({
      ...prevFilters,
      orderBy: value,
    }));
  };

  const { data: storeNFTData } = trpc.clientNFT.getStoreNFTS.useQuery(
    { ...sortFilter, store_id:process.env.NEXT_PUBLIC_STORE_ID },
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log(storeNFTData,"storeNFTDatastoreNFTData")

  console.log(sortFilter, "sortFilter front");
  const { data: NFTCollection } = trpc.clientNFT.getNFTHomeCollection.useQuery(
    { ...sortFilter, contract_id: contract_id, store_id:process.env.NEXT_PUBLIC_STORE_ID },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(contract_id, "contract_id ");
  console.log(contract_id, "NFTCollection ");

  const { data: NFTCollectionDetail } =
    trpc.clientCollection.getStoreCollection.useQuery(
      { id: contract_id ,store_id:process.env.NEXT_PUBLIC_STORE_ID },
      {
        refetchOnWindowFocus: false,
      }
    );
  return (
    <>
      <div className=" h-full  w-full ">
        <div
          className={
            storeNFTData !== undefined
              ? "m-4 flex flex-col items-center justify-between xs:flex-row"
              : "hidden"
          }
        >
          {NFTCollectionDetail && (
            <div>
              <h1 className="text-2xl">{NFTCollectionDetail.name}</h1>
            </div>
          )}
          <div
            className={`flex  flex-col ${
              NFTCollectionDetail ? "" : "w-full"
            } items-center xs:flex-row-reverse`}
          >
            <div className="w-full xs:w-60   ">
              <input
                type="text"
                placeholder="Search by NFT Name"
                className=" w-full rounded-lg bg-white p-2 font-storeFont text-sm focus:outline-none "
                onChange={handleKeyPress}
              />
            </div>

            <div className="mx-2 my-2 w-full xs:w-56 md:my-0">
              <select
                data-te-select-init
                className="w-full rounded-lg p-2 font-storeFont bg-white text-sm text-tx-3 focus:outline-none"
                onChange={(e) => sorNFT(e.target.value)}
                value={"select"}
              >
                <option
                  value="select"
                  disabled
                  hidden
                  className="bg-white font-storeFont"
                >
                  Sort By
                </option>
                <option value="name-asc" className="font-storeFont">
                  A to Z
                </option>
                <option value="name-desc" className="font-storeFont">
                  Z to A
                </option>
                <option value="price-desc" className="font-storeFont">
                  Price Highest to Lowest
                </option>
                <option value="price-asc" className="font-storeFont">
                  Price Lowest to Highest
                </option>
              </select>
            </div>
          </div>
        </div>

        {storeNFTData && contract_id == undefined && (
          <div
            className={
              "grid w-full grid-cols-1 gap-x-2 gap-y-4 sx:grid-cols-2 mdx:grid-cols-3 xlg:grid-cols-4"
            }
          >
            {storeNFTData.map((nft, i) => (
              <span key={i}>
                <NFTCard nft={nft}  />
              </span>
            ))}
          </div>
        )}

        {contract_id !== undefined && NFTCollection && (
          <div
            className={
              "grid w-full grid-cols-1 gap-x-2 gap-y-4 sx:grid-cols-2 mdx:grid-cols-3 xlg:grid-cols-4"
            }
          >
            {NFTCollection.map((nft, i) => (
              <span key={i}>
                <NFTCard nft={nft}  />
              </span>
            ))}
          </div>
        )}

        {storeNFTData == undefined && NFTCollection == undefined && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <h1 className="text-2xl ">No NFT's available yet</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default NFTListing;
