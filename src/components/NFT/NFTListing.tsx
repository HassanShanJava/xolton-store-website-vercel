import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";

import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

const NFTListing = ({ contract_id }: any) => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.user);
  const [nfts, setNfts] = useState<any>([]);
  console.log(user,'user')
  const [searchQuery, setSearchQuery] = useState("");
  const [sortFilter, setSortFilter] = useState<any>({ rows: 8, first: 0 });

  const {
    isLoading,
    isError,
    data: storeNfts,
    refetch,
    isFetching,
    error,
  } = useQuery(
    ["nfts"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?store_id=${
          process.env.NEXT_PUBLIC_STORE_ID
        }&${new URLSearchParams(sortFilter).toString()}${user ? '&store_customer_id='+user?.id :''}`
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSortFilter((prevFilters: any) => ({
        ...prevFilters,
        searchQuery,
        first: 0,
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      contract_id: contract_id ?? "",
    }));
  }, [contract_id]);

  useEffect(() => {
    refetch();
  }, [sortFilter]);

  useEffect(() => {
    if (storeNfts?.data.length > 0) {
      if (sortFilter.searchQuery?.length || sortFilter?.orderBy?.length) {
        if (sortFilter?.first > 0) {
          setNfts([...nfts, ...storeNfts?.data]);
        } else {
          setNfts([...storeNfts?.data]);
        }
      } else {
        if (sortFilter?.first > 0) {
          setNfts([...nfts, ...storeNfts?.data]);
        } else {
          setNfts([...storeNfts?.data]);
        }
      }
    } else {
      if (sortFilter.searchQuery?.length) {
        setNfts([]);
      }
    }
  }, [storeNfts, isError, error]);

  const sorNFT = (value: string) => {
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      orderBy: value,
      first: 0,
    }));
  };

  function onFilter() {
    if (storeNfts.data.length % 8 === 0) {
      setSortFilter((prevFilters: any) => ({
        ...prevFilters,
        first: prevFilters?.first + 1,
      }));
    }
  }

  function clearFilter() {
    setSearchQuery("");
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      first: 0,
      orderBy: "",
      searchQuery: "",
    }));
  }

  return (
    <>
      <div className=" h-full  w-full ">
        {/* search and sort */}
        <div
          className={
            "my-4 flex flex-col items-center justify-between md:flex-row"
          }
        >
          <div>
            {contract_id !== undefined && (
              <h1 className="text-2xl">{NFTCollectionDetail?.data?.name}</h1>
            )}
          </div>

          <div
            className={`flex  flex-col ${
              NFTCollectionDetail?.data || nfts ? "w-full md:w-[50%]" : "w-full"
            } items-center gap-2 xs:flex-row-reverse`}
          >
            <div className=" mx-auto flex w-full flex-row-reverse items-center justify-between xs:w-fit md:mx-0">
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
                    value={searchQuery}
                    placeholder="Search by NFT Name"
                    className=" md:w-68 w-full rounded-lg bg-white p-2 font-storeFont text-xs focus:outline-none sm:text-sm "
                    onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* nfts list */}
        {nfts?.length > 0 ? (
          <div className="w-full">
            <InfiniteScroll
              dataLength={nfts.length > 0 && nfts.length}
              next={onFilter}
              hasMore={true}
              loader={
                isFetching ? (
                  <>{<LoadingSkeleton data={4} nft={nfts} />}</>
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
        ) : (
          <>
            <LoadingSkeleton data={4} nft={nfts} />
          </>
        )}

        {isError ||
          (nfts.length == 0 && (
            <div className="flex min-h-[40vh] items-center justify-center">
              <h1 className="text-2xl ">No NFT's available yet</h1>
            </div>
          ))}
      </div>
    </>
  );
};

export default NFTListing;

const LoadingSkeleton = ({ data, nft }: any) => {
  return (
    <>
      {nft.length > 0
        ? Array.from(Array(data).keys()).map((nft, i) => (
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
          ))
        : ""}
    </>
  );
};
