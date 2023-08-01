// "use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import {
  renderNFTImage,
  customTruncateHandler,
  maticToUSD,
  websiteInfo,
  displayDate,
} from "~/utils/helper";
import { useSelector } from "react-redux";
import NFTCard from "./NFTCard";

import Popup from "../Ui/Popup";

import { web3Init } from "~/store/slices/web3Slice";
import Web3 from "web3";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Menu,
  MenuButton,
  Spinner,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
} from "@chakra-ui/react";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CustomToast } from "../globalToast";
import OfferPopUp from "../Ui/OfferPopUp";
import { getBalance } from "~/utils/web3/offer/wmaticFunction";
import CancelOfferModal from "../Modal/UpdateModal";
import { LoadingeModal } from "../Ui/LoadingModal";

const NFTDetail = ({}: any) => {
  const { user }: any = useSelector((state: RootState) => state.user);
  const { maticToUsd } = useSelector((state: RootState) => state.matic);
  const [wmaticBalance, setWmaticBalance] = useState("");
  const [updateOffer, setUpdateOffer] = useState(""); //offer id
  const [remainingTime, setRemainingTime] = useState<any>(null);

  const router = useRouter();
  const { id } = router.query;
  console.log({ id });
  const [showOfferPop, setShowOfferPop] = useState(false);
  const [offer, setOffer] = useState<any>([]);
  const [filter, setFilter] = useState({
    take: 5,
    skip: 0,
  });
  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [usdMatic, setUsdMatic] = useState<any>("");
  const [usdMinPriceMatic, setUsdMinPriceMatic] = useState<any>("");

  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);
  const { addToast } = CustomToast();
  //
  console.log(user?.id, "user?.id");
  // nft detail api
  const {
    isLoading: nftLoading,
    isError,
    isFetched,
    data: nftDetail,
    refetch,
    error,
  } = useQuery(
    ["nftDetails"],
    async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?id=${id}&store_id=${
          process.env.NEXT_PUBLIC_STORE_ID
        }${user?.id ? "&store_customer_id=" + user?.id : ""}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data?.data[0];
    },
    {
      refetchOnWindowFocus: false,
      enabled: id ? true : false,
    }
  );
  // nft offers
  const {
    data: NFTOffer,
    isLoading: offerLoading,
    refetch: NFTOfferRefetch,
    isFetching: offerFetching,
  } = useQuery(
    ["nftOffer"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft?store_id=${
          process.env.NEXT_PUBLIC_STORE_ID
        }&nft_id=${id}&sell_type=${
          nftDetail?.sell_type?.includes("offer") ? "offer" : "auction"
        }&${new URLSearchParams(filter as any).toString()}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (filter?.skip > 0) {
        setOffer([...offer, ...data?.data]);
      } else {
        setOffer([...data?.data]);
      }
      return data?.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: id ? true : false,
    }
  );
  // nft collection api
  const {
    data: NFTCollection,
    refetch: CollectionRefetch,
    isLoading,
    isFetching,
  } = useQuery(
    ["nftCollection"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?store_id=${
          process.env.NEXT_PUBLIC_STORE_ID
        }${user ? "&store_customer_id=" + user?.id : ""}${
          nftDetail?.contract_id?.$oid
            ? "&contract_id=" + nftDetail?.contract_id?.$oid
            : ""
        }&rows=5&first=0`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data?.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: nftDetail?.contract_id.$oid ? true : false,
    }
  );
  console.log({ nftDetail });
  // buy nft
  const buyNFT = async () => {
    account == ""
      ? addToast({
          id: "connect-wallet-buy",
          message: "Connect Wallet",
          type: "error",
        })
      : user !== null && user?.wallet_address !== nftDetail?.owner_id
      ? setShowPop(true)
      : account == nftDetail.creator_id ||
        account == nftDetail?.store_makerorder?.baseAccount
      ? addToast({
          id: "connect-wallet-buy",
          message: "Owner cannot buy there own NFT",
          type: "error",
        })
      : setShowPop(true);

    const balance = await web3?.eth.getBalance(account);
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    setAccountBalance(accountBalance);
  };

  // offer nft
  const offerNFT = async (offerid?: any) => {
    if (account === null || account === "") {
      addToast({
        id: "connect-wallet-buy",
        message: "Connect Wallet",
        type: "error",
      });
    } else if (
      account == nftDetail?.creator_id ||
      account == nftDetail?.store_makerorder?.baseAccount
    ) {
      addToast({
        id: "connect-wallet-buy",
        message: "Owner cannot buy there own NFT",
        type: "error",
      });
    } else {
      setShowOfferPop(true);
      if (offerid !== "") {
        setUpdateOffer(offerid);
      }

      const balance = await web3?.eth.getBalance(account);
      const accountBalance = web3?.utils.fromWei(balance, "ether");
      let wmaticBalance: any = await getBalance(web3, account);
      wmaticBalance = web3?.utils.fromWei(wmaticBalance?.amount, "ether");
      setWmaticBalance(wmaticBalance);
      setAccountBalance(accountBalance);
    }
  };
  const AllRefetch = async () => {
    await refetch();
    await CollectionRefetch();
    await NFTOfferRefetch();
  };
  useEffect(() => {
    let timeout: any;
    timeout = setTimeout(() => {
      if (user?.id !== undefined) {
        AllRefetch();
      }
    }, 2000);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [user?.id]);
  useEffect(() => {
    AllRefetch();
  }, [typeof window !== "undefined"]);
  const modalParam: any = {
    filter,
    setFilter,
    offer,
    setOffer,
    NFTOffer,
    offerLoading,
    NFTOfferRefetch,
    offerFetching,
    setShowOfferPop,
    showOfferPop,
    addToast,
    offerNFT,
    refetch,
    AllRefetch,
  };

  const startDate: any =
    isFetched && nftDetail?.end_date && new Date(nftDetail?.updated_at?.$date);
  const endDate: any =
    isFetched && nftDetail?.end_date && new Date(nftDetail?.end_date?.$date);
  //  calculate remaining time for nft auction
  const calculateRemainingTime = () => {
    const now: any = new Date();
    if (now >= startDate && now <= endDate && isFetched) {
      const duration: number = Math.floor((endDate - now) / 1000); // Duration in seconds

      const days: number = Math.floor(duration / 86400); // Seconds in a day: 24 * 60 * 60
      const hours: number = Math.floor((duration % 86400) / 3600); // Remaining seconds divided by seconds in an hour: 60 * 60
      const minutes: number = Math.floor((duration % 3600) / 60); // Remaining seconds divided by seconds in a minute: 60
      const seconds: number = Math.floor(duration % 60); // Remaining seconds

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setRemainingTime(null);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (isFetched) {
        calculateRemainingTime();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [typeof window !== "undefined", isFetched]);

  return (
    <div className="bg-bg-1">
      {nftDetail && (
        <div className="mx-auto max-h-full min-h-screen w-full max-w-[1400px]   px-4 pt-12 font-storeFont ">
          <div className=" mx-auto flex w-full max-w-7xl flex-col items-start justify-between  gap-4 space-y-12 sm:flex-row">
            {/* full nft image */}
            <div className="[min-w-[840px]]:mb-0  top-20  mb-4 h-full max-h-[500px] w-full max-w-xl md:sticky">
              <div className="h-[450px] w-full  space-y-2 sm:px-0">
                <Image
                  src={renderNFTImage(nftDetail)}
                  alt="/nft"
                  width={500}
                  height={400}
                  priority
                  quality={100}
                  className="relative h-full  max-h-[500px] w-full  max-w-[700px] rounded-xl object-cover object-center"
                />
                {nftDetail?.sell_type?.includes("auction") && (
                  <div className="rounded-md bg-white p-2 text-center  ">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500">
                        Sale ends {endDate?.toLocaleString()}
                      </span>
                      <span className=" text-lg text-slate-700">
                        {remainingTime ? remainingTime : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* nft full details */}
            <div className="w-full max-w-xl md:px-0">
              {/* intial details */}
              <p className="text-5xl capitalize">
                {nftDetail?.name}{" "}
                <span className="text-[20px] text-ac-2">
                  #{nftDetail?.token_id}
                </span>
              </p>
              <p className="text-md my-5 max-w-md justify-start text-tx-1">
                {nftDetail?.description}
              </p>

              {/* price and button */}
              <div className="border-tx-4 rounded-[16px] border-2 px-2 ">
                <div className="my-3 flex flex-col justify-between gap-2 md:flex-row">
                  {nftDetail?.sell_type?.includes("fixed") && (
                    <div className="w-full rounded-md bg-white bg-opacity-20 p-2 backdrop-blur-lg backdrop-filter">
                      <p className="text-tx-5 text-sm">Price</p>
                      <span className=" text-lg font-bold">
                        {nftDetail?.price.toFixed(2)}{" "}
                        <span className="text-xs lowercase text-slate-500">
                          MATIC
                        </span>
                      </span>
                      <p className="text-xs lowercase text-slate-500">
                        {`$ ${(
                          +nftDetail?.price * (+maticToUsd as number)
                        ).toFixed(2)}`}
                      </p>
                    </div>
                  )}
                  {(nftDetail?.sell_type?.includes("offer") ||
                    nftDetail?.sell_type?.includes("auction")) && (
                      <div className="w-full rounded-md bg-white bg-opacity-20 p-2 backdrop-blur-lg backdrop-filter">
                        <p className="text-tx-5 text-sm">
                          Highest{" "}
                          {nftDetail?.sell_type?.includes("auction")
                            ? "Bid"
                            : "Offer"}
                        </p>
                        <span className=" text-lg font-bold">
                          {nftDetail.highest_offer
                            ? (+nftDetail?.highest_offer).toFixed(2)
                            : (+nftDetail.min_price).toFixed(2)}

                          <span className="ml-1 text-xs lowercase text-slate-500">
                            MATIC
                          </span>
                        </span>
                        <p className="text-xs lowercase text-slate-500">
                          {`$ ${
                            nftDetail?.highest_offer
                              ? (
                                  +nftDetail?.highest_offer *
                                  (+maticToUsd as number)
                                ).toFixed(2)
                              : (
                                  +nftDetail?.min_price *
                                  (+maticToUsd as number)
                                ).toFixed(2)
                          }`}
                        </p>
                      </div>
                    )}
                </div>
                {user == null ||
                user?.id !== nftDetail?.store_customer_id?.$oid ? (
                  <>
                    <div className="mb-3 flex flex-col gap-2 md:flex-row">
                      {nftDetail?.sell_type?.includes("fixed") && (
                        <button
                          type="button"
                          className="w-full rounded-3xl bg-bg-3 p-4 text-white hover:bg-bg-3/75"
                          onClick={(e) => {
                            e.preventDefault();
                            buyNFT();
                          }}
                        >
                          BUY
                        </button>
                      )}
                      {nftDetail?.sell_type?.includes("offer") && (
                        <button
                          type="button"
                          className="w-full rounded-3xl bg-bg-3 p-4 text-white hover:bg-bg-3/75"
                          onClick={(e) => {
                            e.preventDefault();
                            nftDetail?.is_offered
                              ? offerNFT(updateOffer)
                              : offerNFT();
                          }}
                        >
                          {nftDetail.is_offered ? "Update Offer" : "Offer"}
                        </button>
                      )}
                      {nftDetail?.sell_type?.includes("auction") &&
                        remainingTime && (
                          <button
                            type="button"
                            className="w-full rounded-3xl bg-bg-3 p-4 text-white hover:bg-bg-3/75"
                            onClick={(e) => {
                              e.preventDefault();
                              nftDetail?.is_offered
                                ? offerNFT(updateOffer)
                                : offerNFT();
                            }}
                          >
                            {nftDetail.is_offered ? "Update Bid" : "Bid Now"}
                          </button>
                        )}

                      {showPop && nftDetail && (
                        <Popup
                          open={showPop}
                          nft={nftDetail}
                          setBuy={setShowPop}
                          price={+nftDetail?.price}
                          tax={+nftDetail?.tax}
                          accountBalance={+accountBalance}
                          setAccountBalance={setAccountBalance}
                          refetch={refetch}
                        />
                      )}

                      {showOfferPop && (
                        <OfferPopUp
                          nft={nftDetail}
                          open={showOfferPop}
                          setBuy={setShowOfferPop}
                          price={+nftDetail?.price}
                          tax={+nftDetail?.tax}
                          accountBalance={+accountBalance}
                          wmaticBalance={+wmaticBalance}
                          id={updateOffer}
                          is_updated={nftDetail?.is_offered ? true : false}
                          is_offer={
                            nftDetail?.sell_type?.includes("auction")
                              ? false
                              : true
                          }
                          refetch={AllRefetch}
                        />
                      )}
                    </div>
                  </>
                ) : user !== null ||
                  user?.id === nftDetail?.store_customer_id?.$oid ? (
                  <>
                    <div className="mb-3 flex flex-col gap-2 md:flex-row">
                      {nftDetail?.sell_type?.includes("fixed") && (
                        <button
                          type="button"
                          disabled={true}
                          className="w-full rounded-3xl bg-bg-3 p-4 text-white hover:bg-bg-3/75"
                        >
                          Already Owned
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {/* nft detail */}
              <div className="py-6">
                <Accordion
                  className=" group rounded-xl !border-none bg-white"
                  defaultIndex={[0]}
                  allowToggle
                >
                  <AccordionItem
                    className={` !border-t-0 ${
                      nftDetail?.sell_type.includes("offer")
                        ? " border-b-2 border-tx-2 "
                        : " !border-b-0"
                    }  `}
                  >
                    <h2>
                      <AccordionButton
                        _expanded={{ bg: "lightgray", color: "black" }}
                        className=" group rounded-t-xl"
                      >
                        {/* <Box as="span" flex="1" textAlign="left">
                          Section 1 title
                        </Box> */}
                        <summary className="flex-1 cursor-pointer list-none items-center justify-between p-3 text-left font-medium">
                          <span>NFT Detail</span>
                        </summary>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={0}>
                      <div className="md:text-md   text-xs text-slate-500  sm:text-sm">
                        <div className="flex justify-between p-3">
                          <p>Contract Address</p>
                          <a
                            href={`${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON}/address/${nftDetail?.contract_address}`}
                            target="_blank"
                          >
                            <p className="hover:text-bg-2/80">
                              {customTruncateHandler(
                                nftDetail?.contract_address
                              )}
                            </p>
                          </a>
                        </div>
                        {/*divider  */}
                        <div className=" border-t border-tx-2" />
                        <div className="flex justify-between p-3  ">
                          <p>Token Standard</p>
                          <p>ERC-721</p>
                        </div>
                        {/*divider  */}
                        <div className=" border-t border-tx-2" />
                        <div className="flex justify-between p-3  ">
                          <p>Token ID</p>
                          <p>{nftDetail?.token_id}</p>
                        </div>
                        {/*divider  */}
                        <div className=" border-t border-tx-2" />
                        <div className="flex justify-between p-3 ">
                          <p>Blockchain</p>
                          <p>Polygon - Matic</p>
                        </div>
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                  {nftDetail?.sell_type.includes("offer") && (
                    <OfferList
                      id={id}
                      offer_id={updateOffer}
                      nftDetail={nftDetail}
                      is_offer={true}
                      {...modalParam}
                    />
                  )}
                  {nftDetail?.sell_type.includes("auction") && (
                    <OfferList
                      id={id}
                      offer_id={updateOffer}
                      nftDetail={nftDetail}
                      is_offer={false}
                      remainingTime={remainingTime}
                      {...modalParam}
                    />
                  )}
                </Accordion>
              </div>
            </div>
          </div>

          {/* collection */}
          <div className="mt-10 w-full">
            <CollectionList
              id={nftDetail?._id.$oid}
              contract_id={nftDetail?.contract_id.$oid}
              NFTCollection={NFTCollection}
            />
          </div>
        </div>
      )}
      <LoadingeModal modalState={isLoading || nftLoading || offerLoading} />
    </div>
  );
};

const CollectionList: any = ({ id, contract_id, NFTCollection }: any) => {
  const router = useRouter();
  return (
    NFTCollection && (
      <div className=" mx-auto h-full min-h-screen w-full max-w-7xl   bg-bg-1  py-6 ">
        {/* view more and collection label */}
        <div className=" flex items-center justify-between py-3 ">
          <p className="md:text-md text-sm lg:text-lg">
            From the same collection
          </p>
          <button
            type="button"
            className="md:text-md rounded-lg border-b border-transparent p-1 px-4 text-sm duration-300 hover:border-black hover:bg-white lg:text-lg "
            onClick={() => {
              router.push(`/?contract_id=${contract_id} `);
            }}
          >
            View More
          </button>
        </div>

        {/* collection nfts */}
        <div className="  grid  h-full w-full grid-cols-1 gap-4 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 ">
          {NFTCollection.filter((list: any) => list?._id["$oid"] !== id)?.map(
            (collectionNFT: any, i: any) => (
              <NFTCard nft={collectionNFT} key={i} />
            )
          )}
        </div>
      </div>
    )
  );
};

const OfferList: any = ({
  filter,
  setFilter,
  offer,
  setOffer,
  NFTOffer,
  offerLoading,
  NFTOfferRefetch,
  offerFetching,
  setShowOfferPop,
  showOfferPop,
  addToast,
  nftDetail,
  offerNFT,
  is_offer,
  refetch,
  remainingTime,
  AllRefetch,
}: any) => {
  const { user }: any = useSelector((state: RootState) => state.user);

  // const [offer, setOffer] = useState<any>([]);
  const [isModal, setIsModal] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedOffer, setSelectedOffer] = useState({});

  const router = useRouter();

  //   offer cancel api
  const offerCancelApi = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft?${new URLSearchParams(
          payload
        ).toString()}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      return result;
    },
  });

  const defaultModalParams = {
    selectedOffer,
    setSelectedOffer,
    refetch: AllRefetch,
    detailReftch: refetch,
  };
  const featureModalParams = {
    ...defaultModalParams,
    isModal,
    setIsModal,
    title,
  };

  useEffect(() => {
    NFTOfferRefetch();
  }, [filter?.take, user?.id]);

  const handleFilter = () => {
    setFilter((prevFilters: any) => ({
      ...prevFilters,
      take: prevFilters?.take + 5,
      skip: prevFilters?.take,
    }));
  };
  const cancelOffer = async (data: any) => {
    try {
      setSelectedOffer(data);
      setTitle(is_offer ? "Offer" : "Bid");
      setIsModal(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AccordionItem className="border-none">
      <h2>
        <AccordionButton _expanded={{ bg: "lightgray", color: "black" }}>
          <summary className="flex-1 cursor-pointer list-none items-center justify-between p-3 text-left font-medium">
            <span>{is_offer ? "NFT Offer" : "NFT Bids"}</span>
          </summary>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={0}>
        <div
          className={`md:text-md h-80  ${
            offer && offer?.length > 0 && "overflow-x-hidden  overflow-y-scroll"
          } p-2  text-xs text-slate-500 sm:text-sm `}
        >
          <div className="grid grid-cols-4 justify-between  p-3">
            <p className="col-span-2">Name</p>
            <p>Amount</p>
            <p>Last Placed</p>
          </div>
          {offer && offer?.length > 0 ? (
            offer?.map((item: any, index: any) => {
              return (
                <div key={index}>
                  <div
                    className={`grid ${
                      item?.store_customers?.id == user?.id
                        ? "grid-cols-4 bg-black bg-opacity-20 "
                        : "grid-cols-4 "
                    }  justify-between p-3`}
                  >
                    <p
                      className={
                        item?.store_customers?.id == user?.id
                          ? " col-span-2"
                          : " col-span-2"
                      }
                    >
                      {item?.store_customers?.full_name}
                    </p>
                    <p>{(+item?.offer_amount).toFixed(2)}</p>
                    <p className=" flex flex-row gap-2">
                      {displayDate(item?.created_at)}
                      {item?.store_customers?.id == user?.id && (
                        <>
                          {is_offer ? (
                            <p>
                              <Menu placement="bottom-end">
                                <MenuButton
                                  transition="all 0.3s"
                                  className="mx-auto flex h-fit w-fit  items-center rounded-full  px-2"
                                >
                                  <i className="text-md fas fa-ellipsis-v  text-slate-500 hover:text-gray-950" />
                                </MenuButton>
                                <Portal>
                                  <MenuList
                                    className="absolute -top-7 right-2 bg-bg-3  p-4  text-white hover:bg-bg-3/75"
                                    p={0}
                                    minW="0"
                                    w={"3rem"}
                                  >
                                    <MenuItem p={0}>
                                      <Tooltip
                                        label={
                                          is_offer
                                            ? "Update Offer"
                                            : "Update Bid"
                                        }
                                        placement="left"
                                        className="w-full  font-normal  "
                                      >
                                        <div
                                          className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                          onClick={() => {
                                            offerNFT(item?.id);
                                          }}
                                        >
                                          <i className="text-md fas fa-pen group-hover:text-boxdark cursor-pointer"></i>
                                        </div>
                                      </Tooltip>
                                    </MenuItem>
                                    <MenuItem p={0}>
                                      <Tooltip
                                        label={
                                          is_offer
                                            ? "Cancel Offer"
                                            : "Cancel Bid"
                                        }
                                        placement="left"
                                        className="w-full  font-normal  "
                                      >
                                        <div
                                          className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                          onClick={() => {
                                            cancelOffer(item);
                                          }}
                                        >
                                          <i className="text-md fas fa-xmark group-hover:text-boxdark cursor-pointer"></i>
                                        </div>
                                      </Tooltip>
                                    </MenuItem>
                                  </MenuList>
                                </Portal>
                              </Menu>
                            </p>
                          ) : remainingTime ? (
                            <p>
                              <Menu placement="bottom-end">
                                <MenuButton
                                  transition="all 0.3s"
                                  className="mx-auto flex h-fit w-fit  items-center rounded-full  px-2"
                                >
                                  <i className="text-md fas fa-ellipsis-v  text-slate-500 hover:text-gray-950" />
                                </MenuButton>
                                <Portal>
                                  <MenuList
                                    className="absolute -top-7 right-2 bg-bg-3  p-4  text-white hover:bg-bg-3/75"
                                    p={0}
                                    minW="0"
                                    w={"3rem"}
                                  >
                                    <MenuItem p={0}>
                                      <Tooltip
                                        label={
                                          is_offer
                                            ? "Update Offer"
                                            : "Update Bid"
                                        }
                                        placement="left"
                                        className="w-full  font-normal  "
                                      >
                                        <div
                                          className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                          onClick={() => {
                                            offerNFT(item?.id);
                                          }}
                                        >
                                          <i className="text-md fas fa-pen group-hover:text-boxdark cursor-pointer"></i>
                                        </div>
                                      </Tooltip>
                                    </MenuItem>
                                    <MenuItem p={0}>
                                      <Tooltip
                                        label={
                                          is_offer
                                            ? "Cancel Offer"
                                            : "Cancel Bid"
                                        }
                                        placement="left"
                                        className="w-full  font-normal  "
                                      >
                                        <div
                                          className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                          onClick={() => {
                                            cancelOffer(item);
                                          }}
                                        >
                                          <i className="text-md fas fa-xmark group-hover:text-boxdark cursor-pointer"></i>
                                        </div>
                                      </Tooltip>
                                    </MenuItem>
                                  </MenuList>
                                </Portal>
                              </Menu>
                            </p>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  {/*divider  */}
                  <div className=" border-t border-tx-2" />
                </div>
              );
            })
          ) : (
            <div className=" flex items-center justify-center text-center text-lg">
              {is_offer ? "No Offers Yet!" : "No Bids Yet!"}
            </div>
          )}
          {NFTOffer && NFTOffer?.length > 0 && (
            <div className="mt-4 flex w-full items-center justify-center ">
              <button
                // disabled={!notificationData?.isRemaining || isLoading}
                onClick={handleFilter}
                className={`  mt-4 flex items-center justify-center rounded-full bg-gray-300/30 px-3 py-2 duration-150 hover:bg-gray-300/80 `}
              >
                {offerFetching ? (
                  <Spinner size="md" thickness={"4px"} />
                ) : (
                  "See More"
                )}
              </button>
            </div>
          )}
        </div>
      </AccordionPanel>
      <CancelOfferModal {...featureModalParams} />
    </AccordionItem>
  );
};

NFTDetail.getIntialProps = async () => {
  const res = await websiteInfo();

  const json = await res?.json();
  return { navData: json.navData, webData: json.webData };
};
export default NFTDetail;
