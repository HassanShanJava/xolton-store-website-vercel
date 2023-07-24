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

import {
  customEmailTruncateHandler,
  customTruncateHandler,
  displayDate,
  renderNFTImage,
} from "~/utils/helper";
import { Collapse, Tooltip, useDisclosure } from "@chakra-ui/react";

import Image from "next/image";
import Link from "next/link";
import { LoadingeModal } from "../Ui/LoadingModal";
import { Input } from "../Ui/Input";
import { getBalance } from "~/utils/web3/offer/wmaticFunction";
import { RootState } from "~/store/store";
import { CustomToast } from "../globalToast";
import UpdateModal from "./nftModal";

const emptyMessage = (
  <p className="py-8 text-center text-2xl font-semibold">No Bids found!</p>
);

const OfferTable = ({ bid_type }: any) => {
  const { user } = useSelector((state: any) => state.user);
  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  const { addToast } = CustomToast();

  const [remainingTime, setRemainingTime] = useState<any>(null);
  const [isModal, setIsModal] = useState(false);
  const [title, setTitle] = useState("");
  const [sellType, setSetSellType] = useState("");
  const [selectNft, setSelectNft] = useState({});
  console.log({ user });
  const initialOrderFilters = {
    store_id: process.env.NEXT_PUBLIC_STORE_ID,

    searchQuery: "",
    rows: 10,
    first: 0,
    page: 0,
    bid_type,
  };

  const [orderFilters, setOrderFilters] = useState<any>({
    store_id: process.env.NEXT_PUBLIC_STORE_ID,
    searchQuery: "",
    rows: 10,
    first: 0,
    page: 0,
    bid_type,
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
    ["offer-nft/bids"],
    async () => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/offer-nft/bids?&${new URLSearchParams(orderFilters).toString()}${
          user?.id ? "&store_customer_id=" + user?.id : ""
        }`
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
  // useEffect(() => {
  //   if (user !== null) {
  //     setOrderFilters((prevFilters: any) => ({
  //       ...prevFilters,
  //       store_customer_id: user?.id ?? "",
  //     }));
  //   }
  // }, [user]);

  const startDate: any =
    orderData?.store_nfts?.end_date &&
    new Date(orderData?.store_nfts?.updated_at);
  const endDate: any =
    orderData?.store_nfts?.end_date &&
    new Date(orderData?.store_nfts?.end_date);
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
  const handleOfferClick = async (data: any, type: string) => {
    try {
      if (type == "reject") {
        setSelectNft(data);
        setSetSellType(data?.store_nft?.sell_type);
        setTitle("Reject");
        setIsModal(true);
      } else {
        // router.push(`/store/nfts/list/${data?.id}`);
        if (account !== "") {
          if (account === data?.StoreMakerOffer[0]?.nft_owner) {
            const price =
              data?.StoreMakerOffer[0]?.price + data?.StoreMakerOffer[0]?.tax;
            const Walletbalance = await getBalance(
              web3,
              data?.StoreMakerOffer[0]?.signer
            );
            console.log({ Walletbalance });
            if (+Walletbalance?.amount >= price) {
              setSelectNft(data);
              setTitle("Accept");
              setSetSellType(data?.store_nft?.sell_type);

              setIsModal(true);
            } else {
              throw new Error("Customer Wallet Balance is Insufficient!");
            }
          } else {
            throw new Error(
              `Connect to provided wallet address in order to accept offer \n ${data?.StoreMakerOffer[0]?.nft_owner}`
            );
          }
        } else {
          throw new Error("Connect Meta Mask Wallet");
        }
      }
    } catch (e: any) {
      addToast({
        id: "list-toast",
        message: e?.message,
        type: "error",
      });
    }
  };
  function displayAction(data = {} as any) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate: any = data?.store_nfts?.end_date && new Date();
    const secondDate: any =
      data?.store_nfts?.end_date && new Date(data?.store_nfts?.end_date);
    const diffDays =
      data?.store_nfts?.end_date &&
      Math.ceil((secondDate - firstDate) / (1000 * 60 * 60 * 24));
    // const formattedAmount = new Intl.NumberFormat('en-us').format(amount);
    console.log({ secondDate });
    return (
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {data?.store_nfts?.sell_type?.includes("offer") ? (
          <>
            <button
              type="button"
              onClick={() => handleOfferClick(data, "accept")}
              className="rounded-l-lg border border-gray-200 bg-green-500  px-4 py-2 text-sm font-medium text-white opacity-70 hover:opacity-100  focus:z-10 focus:ring-0   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white  dark:focus:text-white"
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => handleOfferClick(data, "reject")}
              className="rounded-r-md border border-gray-200 bg-red-500 px-4 py-2  text-sm font-medium text-white opacity-70 hover:opacity-100  focus:z-10 focus:ring-0   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white  dark:focus:text-white"
            >
              Reject
            </button>
          </>
        ) : data?.store_nfts.sell_type?.includes("auction") && diffDays <= 0 ? (
          <>
            <button
              type="button"
              onClick={() => handleOfferClick(data, "accept")}
              className="rounded-l-lg border border-gray-200 bg-green-500  px-4 py-2 text-sm font-medium text-white opacity-70 hover:opacity-100  focus:z-10 focus:ring-0   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white  dark:focus:text-white"
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => handleOfferClick(data, "reject")}
              className="rounded-r-md border border-gray-200 bg-red-500 px-4 py-2  text-sm font-medium text-white opacity-70 hover:opacity-100  focus:z-10 focus:ring-0   dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white  dark:focus:text-white"
            >
              Reject
            </button>
          </>
        ) : (
          <> - </>
        )}
      </div>
    );
  }
  const defaultModalParams = {
    selectNft,
    setSelectNft,
    refetch,
  };
  const featureModalParams = {
    ...defaultModalParams,
    isModal,
    setIsModal,
    title,
    sell_type: sellType,
    setSetSellType,
  };
  return (
    <div className="mx-auto  h-full min-h-screen w-full max-w-[90%] space-y-6 py-10">
      <div className="flex items-end justify-between gap-2 xss:flex-col md:flex-row ">
        <div className="mx-auto w-full">
          <h2 className="text-4xl">
            {bid_type === "made" ? "Bids Made" : "Bids Received"}
          </h2>
          <p className="text-md mt-2">
            Enhance Project Success through Activity Tracking
          </p>
        </div>
        <div className="flex justify-end  gap-2 xss:flex-col sm:flex-row">
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="color group mr-2  flex h-11 w-11 items-center justify-center rounded-full text-center ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-ac-1 hover:ring-ac-1"
            >
              <i className="fa fa-undo scale-x-[-1] text-pm-12 group-hover:text-white"></i>
            </button>

            <button
              onClick={onToggle}
              className="color mr-2 w-fit rounded-full ring-1 ring-pm-11 duration-150 ease-in-out  hover:bg-ac-1 hover:ring-ac-1"
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
          </div>

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
            body={(nft) => displayNFT(nft?.store_nfts)}
            field="name"
            header="NFT"
            style={{ minWidth: "12rem" }}
            sortable
          ></Column>
          <Column
            body={(nft) => (
              <Tooltip
                label={nft?.store_customers?.email}
                placement="bottom-start"
              >
                <p>
                  {customEmailTruncateHandler(nft?.store_customers?.email, 28)}
                </p>
              </Tooltip>
            )}
            field="name"
            header="Customer Email"
            style={{ minWidth: "12rem" }}
            sortable
          ></Column>
          <Column
            body={(nft) => displayAmount(nft?.offer_amount)}
            field="offer_amount"
            header="Offer Amount"
            sortable
          ></Column>
          <Column
            body={(nft) => nft?.sell_type}
            field="sell_type"
            header="Sell Type"
            sortable
          ></Column>

          <Column
            body={(nft) => displayDate(nft?.created_at)}
            field="created_at"
            header="Date"
            sortable
          ></Column>
          {bid_type === "received" ? (
            <Column
              body={(nft) => displayAction(nft)}
              field="Actions"
              header="Actions"
            ></Column>
          ) : (
            ""
          )}
          {/* <Column
            body={(nft) => displayAction(nft)}
            field="Actions"
            header="Actions"
          ></Column> */}
        </DataTable>
        <Paginator
          first={orderFilters.first}
          rows={orderFilters.rows}
          totalRecords={orderData?.count}
          onPageChange={onPageChange}
        />
      </div>
      <UpdateModal {...featureModalParams} />

      <LoadingeModal modalState={isLoading || isFetching} />
    </div>
  );
};
export default OfferTable;

function displayNFT(nft: any = {}) {
  return (
    <div className="flex items-center space-x-2">
      <Image
        className="h-10 w-10   rounded-lg bg-ac-2 object-cover"
        src={renderNFTImage(nft)}
        alt={nft?.name}
        width={32}
        height={32}
      />
      <Tooltip label={nft?.name} placement="bottom-start">
        <Link href={`/nft-details/${nft?.id}`}>
          <p>{customTruncateHandler(nft?.name, 15)}</p>
        </Link>
      </Tooltip>
      {/* <p>{nft?.name}</p> */}
    </div>
  );
}
function displayOwner(nft: any = {}) {
  return (
    <div className="flex items-center space-x-2">
      <Tooltip label={nft?.owner_id} placement="bottom-start">
        <p>{customTruncateHandler(nft?.owner_id, 16)}</p>
      </Tooltip>
    </div>
  );
}
function displayContract(contract = {} as any) {
  const transationUrl = `${process.env.NEXT_PUBLIC_POLYGON_TESTNET_URL}/address/${contract?.contract_address}`;

  return (
    <Link
      className="duration-300 ease-in-out hover:text-blue-900 "
      href={transationUrl}
      target="_blank"
    >
      {contract?.name}
    </Link>
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
          {formattedAmount}
        </>
      ) : (
        <p className=" text-center text-2xl font-bold">-</p>
      )}
    </div>
  );
}
function displayType(type = "" as string) {
  return (
    <div className="text-center">
      {type ? (
        <> {type}</>
      ) : (
        <p className=" text-center text-2xl font-bold">-</p>
      )}
    </div>
  );
}
