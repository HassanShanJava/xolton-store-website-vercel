import React, { useEffect, useState, useRef } from "react";

import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import NFTCard from "../NFT/NFTCard";
import ListingPopup from "./ListingPopup";
import UpdateNftModal from "./UpdateNftModal";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";

import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";

import { customTruncateHandler, displayDate } from "~/utils/helper";
import { Collapse, useDisclosure } from "@chakra-ui/react";

import Image from "next/image";
import Link from "next/link";
import { LoadingeModal } from "../Ui/LoadingModal";
import { Input } from "../Ui/Input";

const emptyMessage = (
  <p className="py-8 text-center text-2xl font-semibold">No orders found!</p>
);

const OrderTable = () => {
  const { user } = useSelector((state: any) => state.user);
  console.log({ user });
  const initialOrderFilters = {
    store_id: process.env.NEXT_PUBLIC_STORE_ID,
    startDate: null,
    endDate: null,
    searchQuery: "",
    rows: 10,
    first: 0,
    page: 0,
  };
  const [orderFilters, setOrderFilters] = useState<any>({
    store_id: process.env.NEXT_PUBLIC_STORE_ID,
    searchQuery: "",
    rows: 10,
    first: 0,
    page: 0,
  });
  const { isOpen, onToggle } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>();
  const {
    isLoading,
    isError,
    data: orderData,
    refetch,
    isFetching,
    error,
  } = useQuery(
    ["nfts"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-nft?&${new URLSearchParams(
          orderFilters
        ).toString()}${user !== null ? "&store_customer_id=" + user?.id : ""}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: user === null ? false : true,
    }
  );
  // useEffect(() => {
  //   if (user !== null) {
  //     setOrderFilters((prevFilters: any) => ({
  //       ...prevFilters,
  //       store_customer_id: user?.id ?? "",
  //     }));
  //   }
  // }, [user]);
  useEffect(() => {
    let timeout: any;
    timeout = setTimeout(() => {
      if (user !== null) {
        refetch();
      }
    }, 2000);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [user]);
  useEffect(() => {
    if (orderData) {
      refetch();
    }
  }, [orderFilters]);

  function handleFilters(key: string, value: string) {
    setOrderFilters((prevFilters: any) => ({ ...prevFilters, [key]: value }));
  }
  function clearFilters() {
    setOrderFilters(initialOrderFilters);
    if (inputRef?.current?.value) inputRef.current.value = "";
  }

  function handleKeyPress(e: any) {
    const key = e.key;
    console.log("i am here");
    if (key == "Enter") {
      setOrderFilters((prevFilters: any) => ({
        ...prevFilters,
        searchQuery: e.target.value,
      }));
    }
  }
  function onPageChange(data: any) {
    setOrderFilters((prevFilters: any) => ({
      ...prevFilters,
      first: data.first,
      rows: data.rows,
      page: data.page,
    }));
  }

  return (
    <div className="mx-auto  h-full min-h-screen w-full max-w-[90%] space-y-6 py-10">
      <div className="xsss:flex-col flex items-end justify-between gap-2 md:flex-row ">
        <div className="mx-auto w-full">
          <h2 className="text-4xl">Product Activities</h2>
          <p className="text-md mt-2">
            Enhance Project Success through Activity Tracking
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="color group mr-2 w-16 rounded-full ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-ac-1 hover:ring-ac-1"
          >
            <i className="fa fa-undo scale-x-[-1] text-pm-12 group-hover:text-white"></i>
          </button>

          <button
            onClick={onToggle}
            className="color mr-2 rounded-full ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-ac-1 hover:ring-ac-1"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-pm-12  p-2 hover:fill-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0013 17.6C15.1768 17.6 16.1769 18.3513 16.5475 19.3999L22.1007 19.3999C22.5977 19.3999 23.0006 19.8028 23.0006 20.2998C23.0006 20.7968 22.5977 21.1997 22.1007 21.1997L16.5472 21.2005C16.1763 22.2487 15.1765 22.9996 14.0013 22.9996C12.8261 22.9996 11.8263 22.2487 11.4554 21.2005L5.90189 21.1997C5.40487 21.1997 5.00195 20.7968 5.00195 20.2998C5.00195 19.8028 5.40487 19.3999 5.90189 19.3999L11.4551 19.3999C11.8257 18.3513 12.8258 17.6 14.0013 17.6ZM14.0013 19.4C13.5043 19.4 13.1014 19.8029 13.1014 20.2999C13.1014 20.7969 13.5043 21.1999 14.0013 21.1999C14.4983 21.1999 14.9012 20.7969 14.9012 20.2999C14.9012 19.8029 14.4983 19.4 14.0013 19.4ZM20.3008 11.3006C21.7919 11.3006 23.0006 12.5093 23.0006 14.0004C23.0006 15.4914 21.7919 16.7002 20.3008 16.7002C19.1256 16.7002 18.1258 15.9493 17.7549 14.9011L5.90189 14.9003C5.40487 14.9003 5.00195 14.4974 5.00195 14.0004C5.00195 13.5034 5.40487 13.1005 5.90189 13.1005L17.7546 13.1005C18.1252 12.0519 19.1253 11.3006 20.3008 11.3006ZM20.3003 13.1004C19.8033 13.1004 19.4004 13.5033 19.4004 14.0003C19.4004 14.4973 19.8033 14.9003 20.3003 14.9003C20.7974 14.9003 21.2003 14.4973 21.2003 14.0003C21.2003 13.5033 20.7974 13.1004 20.3003 13.1004ZM7.70176 5.00098C8.88229 5.00098 9.88585 5.75868 10.2527 6.8143C10.3008 6.80507 10.3507 6.80085 10.4016 6.80085H22.1007C22.5977 6.80085 23.0006 7.20376 23.0006 7.70078C23.0006 8.1978 22.5977 8.60072 22.1007 8.60072H10.4016C10.3507 8.60072 10.3008 8.59649 10.2522 8.58837C9.88585 9.64288 8.88229 10.4006 7.70176 10.4006C6.2107 10.4006 5.00195 9.19184 5.00195 7.70078C5.00195 6.20972 6.2107 5.00098 7.70176 5.00098ZM7.70226 6.80078C7.20524 6.80078 6.80232 7.2037 6.80232 7.70072C6.80232 8.19774 7.20524 8.60065 7.70226 8.60065C8.19928 8.60065 8.60219 8.19774 8.60219 7.70072C8.60219 7.2037 8.19928 6.80078 7.70226 6.80078Z"
                // fill="black"
              ></path>
            </svg>
          </button>

          <Input
            ref={inputRef}
            onKeyPress={handleKeyPress}
            type="text"
            name="search"
            placeholder="Search by NFT name"
            icon="fas fa-search"
          />
        </div>
      </div>

      <div>
        <Collapse in={isOpen} animateOpacity>
          <div className="flex space-x-4 pb-4">
            <Calendar
              maxDate={new Date()}
              dateFormat="dd-M-yy"
              value={orderFilters?.startDate}
              onChange={(e: any) => handleFilters("startDate", e.value)}
              inputClassName="cursor-pointer hover:!border-inherit h-11 !border-none"
              placeholder="Select start date"
              // showButtonBar
            />
            <Calendar
              maxDate={new Date()}
              dateFormat="dd-M-yy"
              value={orderFilters?.endDate}
              onChange={(e: any) => handleFilters("endDate", e.value)}
              inputClassName="cursor-pointer hover:!border-inherit h-11 !border-none"
              placeholder="Select end date"
              // showButtonBar
            />
          </div>
        </Collapse>

        <DataTable
          removableSort
          rows={10}
          value={orderData?.data}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={emptyMessage}
        >
          <Column
            body={(order) =>
              displayNFT(order?.nft_name, order?.store_nfts?.thumb)
            }
            field="nft_name"
            header="NFT"
            sortable
            frozen={true}
            alignFrozen="left"
          ></Column>
          <Column
            body={(order) => displayDate(order?.created_at)}
            field="created_at"
            header="Date"
            sortable
            style={{ minWidth: 150 }}
          ></Column>
          <Column
            body={(order) => diplayTransactionHash(order?.transaction_id)}
            field="transaction_id"
            header="Transaction Hash"
            sortable
            style={{ minWidth: 200 }}
          ></Column>

          <Column
            body={(order) =>
              customTruncateHandler(order?.previous_owner_address)
            }
            field="previous_owner_address"
            header="From"
            sortable
          ></Column>
          <Column
            body={(order) => customTruncateHandler(order?.owner_address)}
            field="owner_address"
            header="To"
            sortable
          ></Column>
          <Column
            body={(order) => displayAmount(order?.total_amount)}
            field="total_amount"
            header="Total Amount"
            sortable
            style={{ minWidth: 175 }}
          ></Column>
          <Column
            body={(order) => displayAmount(order?.total_tax)}
            field="total_tax"
            header="Total Tax"
            sortable
            style={{ minWidth: 175 }}
          ></Column>
          <Column
            body={(order) => displayAmount(order?.net_amount)}
            field="net_amount"
            header="Net Amount"
            sortable
            style={{ minWidth: 175 }}
          ></Column>
          <Column
            body={(order) => order?.store_nfts.royalties + "%"}
            field="royalties"
            header="Royalty"
            sortable
            style={{ minWidth: 75 }}
          ></Column>
        </DataTable>
        <Paginator
          first={orderFilters.first}
          rows={orderFilters.rows}
          totalRecords={orderData?.count}
          onPageChange={onPageChange}
        />
      </div>
      <LoadingeModal modalState={isLoading} />
    </div>
  );
};
export default OrderTable;

function displayNFT(nft_name = "" as string, thumb = "" as string) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative h-10 w-12 overflow-hidden rounded-md">
        <Image
          className="absolute object-cover"
          src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${thumb}`}
          alt="NFT image"
          fill
        />
      </div>
      <p>{nft_name}</p>
    </div>
  );
}

function displayAmount(amount = 0 as number) {
  const formattedAmount = new Intl.NumberFormat("en-us").format(amount);

  return (
    <div className="text-center">
      {amount > 0 ? (
        <>
          {" "}
          <i className="fa-brands fa-ethereum mr-2"></i>
          {(+formattedAmount)?.toFixed(3)}
        </>
      ) : (
        <p className=" text-center text-2xl font-bold">-</p>
      )}
    </div>
  );
}

function diplayTransactionHash(transaction_id = "" as string) {
  const transationUrl = `${process.env.NEXT_PUBLIC_POLYGON_TESTNET_URL}/tx/${transaction_id}`;
  return (
    <Link
      className="duration-300 ease-in-out hover:text-blue-900 "
      href={transationUrl}
      target="_blank"
    >
      {customTruncateHandler(transaction_id)}
    </Link>
  );
}
