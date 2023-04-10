import React, { useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";

const NFTListing = () => {
  const router = useRouter();
  const { contract_id } = router.query;

  const [sortFilters, setSortFilter] = useState({});
  const { data: storeNFTData } = api.storeNFT.getStoreNFTS.useQuery(
    sortFilters,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: NFTCollection } = api.storeNFT.getNFTCollection.useQuery(
    { contract_id: contract_id },
    {
      refetchOnWindowFocus: false,
    }
  );

  // console.log(NFTCollection,"NFTCollectionNFTCollection")

  console.log(storeNFTData, "storeNFTData");
  return (
    <>
      <div className=" mt-10  h-full w-full ">
        <div className="justify-left flex w-full flex-row-reverse items-center ">
          <div className="mb-3  px-2 ">
            <input
              type="text"
              placeholder="Search by NFT Name"
              className="mx-2 w-60 rounded-lg p-2"
            />
          </div>
          <div className="mb-3  px-2">
            <select data-te-select-init className="rounded-lg p-2">
              <option value="A to Z" selected disabled hidden>
                Sort By
              </option>
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
              <option value="Highest to Lowest">Highest to Lowest</option>
              <option value="Lowest to Highest">Lowest to Highest</option>
            </select>
          </div>
        </div>

        <div className={contract_id ==""?"grid h-full min-h-screen  w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4":"hidden"}>
          {storeNFTData && storeNFTData.map((nft, i) => <NFTCard nft={nft} />)}
        </div>

        <div className="grid h-full min-h-screen  w-full grid-cols-1 gap-4  gap-y-10 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
        {contract_id &&
          NFTCollection &&
          NFTCollection.map((nft, i) => <NFTCard nft={nft} />)}
          </div>
      </div>
    </>
  );
};

export default NFTListing;
