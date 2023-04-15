import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";

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

  const { data: storeNFTData } = api.storeNFT.getStoreNFTS.useQuery(
    { ...sortFilter },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(sortFilter, "sortFilter front");
  const { data: NFTCollection } = api.storeNFT.getNFTHomeCollection.useQuery(
    { ...sortFilter, contract_id: contract_id },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(contract_id, "contract_id ");

  const { data: NFTCollectionDetail } =
    api.storeCollection.getStoreCollection.useQuery(
      { id: contract_id },
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
              <h1>{NFTCollectionDetail.name}</h1>
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
                className=" w-full rounded-lg  p-2 font-storeFont text-sm focus:outline-none "
                onChange={handleKeyPress}
              />
            </div>

            <div className="mx-2  w-full xs:w-56">
              <select
                data-te-select-init
                className="w-full rounded-lg p-2 font-storeFont text-sm text-tx-3 focus:outline-none"
                onChange={(e) => sorNFT(e.target.value)}
              >
                <option
                  value="Sort By"
                  selected
                  disabled
                  hidden
                  className="font-storeFont"
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
              <NFTCard nft={nft} />
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
              <NFTCard nft={nft} />
            ))}
          </div>
        )}

        {storeNFTData == undefined && NFTCollection == undefined && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <h1>No NFT's available yet</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default NFTListing;
