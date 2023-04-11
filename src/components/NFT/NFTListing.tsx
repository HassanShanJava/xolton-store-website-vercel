import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";

import debounce from 'lodash.debounce';

const NFTListing = () => {
  const router = useRouter();
  const { contract_id } = router.query;

  const [sortFilter, setSortFilter] = useState({});

  function handleKeyPress(e: any) {
    if (contract_id == undefined) {
      setSortFilter((prevFilters) => ({
        ...prevFilters,
        searchQuery: e.target.value,
      }));
    } else {
      setSortFilter((prevFilters) => ({
        ...prevFilters,
        searchQuery: e.target.value,
        contract_id: contract_id,
      }));
    }
  }

  const sorNFT = (value: string) => {
    console.log({value},"value")
    setSortFilter((prevFilters) => ({
      ...prevFilters,
      orderBy: value,
    }));
  };

  const { data: storeNFTData } = api.storeNFT.getStoreNFTS.useQuery(
    sortFilter,
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(sortFilter, "sortFilter front");
  const { data: NFTCollection } = api.storeNFT.getNFTHomeCollection.useQuery(
    sortFilter,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div className=" mt-10  h-full w-full ">
        <div className="justify-left flex w-full flex-row-reverse items-center ">
          <div className="mb-3  px-2 ">
            <input
              type="text"
              placeholder="Search by NFT Name"
              className="mx-2 w-60 rounded-lg p-2 focus:outline-none"
              onChange={handleKeyPress}
            />
          </div>
          <div className="mb-3  px-2">
            <select
              data-te-select-init
              className="rounded-lg p-2 focus:outline-none"
              onChange={(e) => sorNFT(e.target.value)}
            >
              <option value="A to Z" selected disabled hidden>
                Sort By
              </option>
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
              <option value="price-desc">Highest to Lowest</option>
              <option value="price-asc">Lowest to Highest</option>
            </select>
          </div>
        </div>

        {storeNFTData && (
          <div
            className={
              contract_id == undefined
                ? "grid h-full min-h-screen  w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "hidden"
            }
          >
            {storeNFTData.map((nft, i) => (
              <NFTCard nft={nft} />
            ))}
          </div>
        )}

        {contract_id && NFTCollection && (
          <div className="grid h-full min-h-screen  w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {NFTCollection.map((nft, i) => (
              <NFTCard nft={nft} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NFTListing;
