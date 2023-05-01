import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
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
    console.log({ value }, "value");
    setSortFilter((prevFilters: any) => ({
      ...prevFilters,
      orderBy: value,
      first: 0,
    }));
  };
  console.log(nfts, "nfts:::");
  function handleKeyPress(e: any) {
    if (contract_id == undefined) {
      setTimeout(() => {
        setSortFilter((prevFilters: any) => ({
          ...prevFilters,
          searchQuery: e.target.value,
          first: 0,
        }));
      }, 800);
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
    }));
    refetch();
  }
  return (
    <>
      <div className=" h-full  w-full ">
        <div
          className={
            nfts?.length > 0
              ? "m-4 flex flex-col items-center justify-between xs:flex-row"
              : "hidden"
          }
        >
          {contract_id !== undefined && (
            <div>
              <h1 className="text-2xl">{NFTCollectionDetail?.data?.name}</h1>
            </div>
          )}
          <div
            className={`flex  flex-col ${
              NFTCollectionDetail?.data ? "" : "w-full"
            } items-center gap-1 xs:flex-row-reverse`}
          >
            <button
              onClick={clearFilter}
              className="color group h-full w-12  rounded-full  ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-ac-2 hover:ring-ac-2"
            >
              <i className="fa fa-undo scale-x-[-1] p-2 text-pm-12 group-hover:text-white"></i>
            </button>
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
                className="w-full rounded-lg bg-white p-2 font-storeFont text-sm text-tx-3 focus:outline-none"
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
                "grid w-full grid-cols-1 gap-x-2 gap-y-4 sx:grid-cols-2 mdx:grid-cols-3 xlg:grid-cols-4"
              }
            >
              {nfts?.map((nft: any, i: number) => (
                <span key={i}>
                  <NFTCard nft={nft} />
                </span>
              ))}
            </InfiniteScroll>
          </div>
        )}

        {(nfts.length == 0 || isError) && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <h1 className="text-2xl ">No NFT's available yet</h1>
          </div>
        )}
        {isLoading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl "></i>
          </div>
        )}
      </div>
    </>
  );
};

export default NFTListing;
