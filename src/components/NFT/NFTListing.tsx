import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";

import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

const NFTListing = () => {
  const router = useRouter();
  const { contract_id } = router.query;
  const [nfts, setNfts] = useState<any>([]);
  const [sortFilter, setSortFilter] = useState<any>({ rows: 8, first: 0 });

  const {
    isLoading,
    isError,
    data: storeNFTValues,
    refetch,
    error,
  } = useQuery(
    ["nfts"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?${
          contract_id != undefined ? "contract_id=" + contract_id + "&" : ""
        }store_id=${process.env.NEXT_PUBLIC_STORE_ID}&${new URLSearchParams(
          sortFilter
        ).toString()}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: true,
    }
  );

  const storeNFTData = storeNFTValues?.data;

  const { data: NFTCollectionDetail } = useQuery(
    ["nftsCollectionDetail"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collection?id=${contract_id}&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: contract_id ? true : false,
    }
  );
  const sorNFT = (value: string) => {
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      orderBy: value,
      first: 0,
    }));
  };
  function handleKeyPress(e: any) {
    if (contract_id == undefined) {
      setTimeout(() => {
        setSortFilter((prevFilters: any) => ({
          ...prevFilters,
          searchQuery: e.target.value,
          first: 0,
        }));
      }, 600);
    } else {
      setTimeout(() => {
        setSortFilter((prevFilters: any) => ({
          ...prevFilters,
          searchQuery: e.target.value,

          first: 0,
        }));
      }, 400);
    }
  }
  useEffect(() => {
    if (storeNFTValues?.data.length > 0) {
      if (sortFilter.searchQuery?.length || sortFilter?.orderBy?.length) {
        if (sortFilter?.first > 0) {
          setNfts([...nfts, ...storeNFTValues?.data]);
        } else {
          setNfts([...storeNFTValues?.data]);
        }
      } else {
        if (sortFilter?.first > 0) {
          setNfts([...nfts, ...storeNFTValues?.data]);
        } else {
          setNfts([...storeNFTValues?.data]);
        }
      }
    } else {
    }
  }, [storeNFTValues?.data]);
  useEffect(() => {
    refetch();
  }, [, sortFilter]);
  useEffect(() => {
    if (contract_id != undefined) {
      setSortFilter((prevFilters: any) => ({
        ...prevFilters,
        first: 0,
        searchQuery: "",
      }));
    }
  }, [contract_id]);
  function onFilter() {
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      first: prevFilters?.first + 1,
    }));
  }
  function clearFilter() {
    router.push("/");
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      first: 0,
      orderBy: "",
      searchQuery: "",
    }));
    refetch();
  }

  return (
    <>
      <div className=" h-full  w-full ">
        <div
          className={
            nfts?.length > 0
              ? "my-4 flex flex-col items-center justify-between md:flex-row"
              : "hidden"
          }
        >
          <div>
            {contract_id !== undefined && (
              <h1 className="text-2xl">{NFTCollectionDetail?.data?.name}</h1>
            )}
          </div>

          <div
            className={`flex  flex-col ${
              NFTCollectionDetail?.data ? "w-full md:w-[50%]" : "w-full"
            } items-center gap-2 xs:flex-row-reverse`}
          >
            <div className=" flex w-full flex-row-reverse items-center justify-between xs:w-fit">
              <button
                onClick={clearFilter}
                className="color group h-8 w-8 rounded-full bg-white ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-bg-3/75 hover:ring-bg-3/75"
              >
                <i className="fa fa-undo scale-x-[-1] p-2  text-pm-12 group-hover:text-white"></i>
              </button>
              <div className="mr-2 flex w-full flex-col items-center justify-between xs:mr-0 xs:flex-row">
                <div className="md:w-68 w-full ">
                  <input
                    type="text"
                    placeholder="Search by NFT Name"
                    className=" md:w-68 w-full rounded-lg bg-white p-2 font-storeFont text-xs focus:outline-none sm:text-sm "
                    onChange={handleKeyPress}
                  />
                </div>

                <div className="m-2 w-full xs:w-56 md:my-0">
                  <select
                    data-te-select-init
                    className="w-full rounded-lg bg-white p-2 font-storeFont text-xs text-tx-3 focus:outline-none sm:text-sm"
                    onChange={(e) => sorNFT(e.target.value)}
                    value={sortFilter.orderBy}
                  >
                    <option value="" className="bg-white font-storeFont ">
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
          </div>
        </div>

        {nfts && (
          <div className="w-full">
            <InfiniteScroll
              dataLength={nfts.length > 0 && nfts.length}
              next={onFilter}
              hasMore={true}
              loader={
                isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin text-1xl text-center "></i>
                ) : (
                  <></>
                )
              }
              className={
                "grid w-full grid-cols-1 gap-5 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
              }
            >
              {nfts?.map((nft: any, i: number) => (
                <NFTCard nft={nft} key={i} />
              ))}
            </InfiniteScroll>
          </div>
        )}

        {(nfts.length == 0 || isError) && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <h1 className="text-2xl ">No NFT's available yet</h1>
          </div>
        )}

        {/* loading skeletion */}
        {isLoading && (
          <div className="grid w-full grid-cols-1 gap-5 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {/* only showing 5 nfts as loading in all screens */}
            {["","","","",""].map((nft, i) => (
              <div
                key={i}
                className=" mx-auto h-auto w-full  max-w-[350px]   rounded-[20px] bg-[#fafafa] p-3 hover:bg-white"
              >
                {/* loading nft image */}
                <div
                  className={
                    "relative h-80 max-h-[290px] w-full animate-[pulse_1s_ease-in-out_infinite] rounded-[20px] bg-gray-300"
                  }
                ></div>

                {/* loading name and prices */}
                <div className="">
                  <div className="flex items-center justify-between px-2.5 py-4">
                    <div className="h-2 w-20 animate-[pulse_1s_ease-in-out_infinite] rounded bg-gray-300"></div>
                    <div className="h-2 w-20 animate-[pulse_1s_ease-in-out_infinite] rounded bg-gray-300"></div>
                  </div>

                  <div className="px-2">
                    <button
                      type="button"
                      disabled
                      className="w-full  rounded-[6px]  bg-bg-3/75 py-3 text-center font-storeFont text-white "
                    >
                      <div className="flex items-center justify-center">
                        <div className="progress"></div>
                        <div className="progress"></div>
                        <div className="progress"></div>
                        <div className="progress"></div>

                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NFTListing;
