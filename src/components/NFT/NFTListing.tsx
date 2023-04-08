import React from "react";
import NFTCard from "./NFTCard";


import { api } from "~/utils/api";

const NFTListing = () => {
  const { data: storeNFTData } = api.storeNFT.getStoreNFTS.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(storeNFTData, "storeNFTData");
  return (
    <>
      <div className="h-full max-h-full w-full ">
        
        <div className="flex flex-row-reverse justify-between items-center w-full ">
          <div className="mb-3  px-2">
            <select data-te-select-init className="p-2 rounded-lg">
              <option value="A to Z" selected disabled hidden>Sort By</option>
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
              <option value="Highest to Lowest">Highest to Lowest</option>
              <option value="Lowest to Highest">Lowest to Highest</option>
            </select>
          </div>
        </div>
        
        <div className="grid h-full w-full  grid-cols-1  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {storeNFTData &&
            storeNFTData.map((nft, i) => (
              <NFTCard nft={nft} key={i} />
            ))}
        </div>

      </div>
    </>
  );
};

export default NFTListing;
