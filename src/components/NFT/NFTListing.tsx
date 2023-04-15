import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";


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
    { ...sortFilter },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(sortFilter, "sortFilter front");
  const { data: NFTCollection }= api.storeNFT.getNFTHomeCollection.useQuery(
    { ...sortFilter, contract_id: contract_id, },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(contract_id, "contract_id ");
  return (
    <>
      <div className=" h-full  w-full py-10 ">
        <div className="justify-left flex w-full flex-col items-center xs:flex-row-reverse ">
          <div className="mb-3 w-full xs:w-60   ">
            <input
              type="text"
              placeholder="Search by NFT Name"
              className=" w-full text-sm  rounded-lg p-2 focus:outline-none font-storeFont "
              onChange={handleKeyPress}
            />
          </div>

          <div className="mx-2 mb-3 w-full xs:w-56">
            <select
              data-te-select-init
              className="w-full rounded-lg text-tx-3 p-2 text-sm focus:outline-none font-storeFont"
              onChange={(e) => sorNFT(e.target.value)}
            >
              <option value="Sort By" selected disabled hidden className="font-storeFont">
                Sort By
              </option>
              <option value="name-asc" className="font-storeFont">A to Z</option>
              <option value="name-desc" className="font-storeFont">Z to A</option>
              <option value="price-desc" className="font-storeFont">Price Highest to Lowest</option>
              <option value="price-asc" className="font-storeFont">Price Lowest to Highest</option>
            </select>
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
      </div>
    </>
  );
};

export default NFTListing;
