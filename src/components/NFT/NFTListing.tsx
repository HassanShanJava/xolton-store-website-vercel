import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import useDebounce from "~/utils/helper";

const NFTListing = () => {
  const router = useRouter();
  const { contract_id } = router.query;

  const [sortFilter, setSortFilter] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // const debounceTerm = useDebounce(searchTerm, 400);

  function handleKeyPress(e: any) {
    if (contract_id == undefined) {
      setTimeout(() => {
        setSortFilter((prevFilters) => ({
          ...prevFilters,
          searchQuery: e.target.value,
        }));
      }, 400);
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
    sortFilter,
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
  return (
    <>
      <div className=" h-full  w-full p-10 ">
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

        {storeNFTData && contract_id == undefined && (
          <div
            className={
              "grid    w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }
          >
            {storeNFTData.map((nft, i) => (
              <NFTCard nft={nft} />
            ))}
          </div>
        )}

        {contract_id !== undefined && NFTCollection && (
          <div className="grid h-full   w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
