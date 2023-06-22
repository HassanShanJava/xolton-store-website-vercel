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
  Box,
  useToast,
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
import UpdateModal from "../Modal/UpdateModal";
import { getBalance } from "~/utils/web3/offer/wmaticFunction";

const NFTDetail = ({ NFTDetail }: any) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { maticToUsd } = useSelector((state: RootState) => state.matic);
  const [wmaticBalance, setWmaticBalance] = useState("");

  const router = useRouter();
  const { id } = router.query;
  console.log({id})
  const [showOfferPop, setShowOfferPop] = useState(false);
  const [filter, setFilter] = useState({
    take: 5,
    skip: 0,
  });
  const [showPop, setShowPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [usdMatic, setUsdMatic] = useState<any>("");
  const [usdMinPriceMatic, setUsdMinPriceMatic] = useState<any>("");

  const toast = useToast();

  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);
  const { addToast } = CustomToast();

  // nft detail api
  // const {
  //   isLoading,
  //   isError,
  //   isFetched,
  //   data: nftApiDetail,
  //   refetch,
  //   error,
  // } = useQuery(
  //   ["nftDetail"],
  //   async () => {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/nft?id=${id}&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

  // const NFTDetail = nftApiDetail?.data[0];

  // nft collection api
  const { data: NFTCollection } = useQuery(
    ["nftCollection"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nft?contract_id=${NFTDetail?.contract_id}&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    {
      refetchOnWindowFocus: false,
      enabled: NFTDetail?.contract_id ? true : false,
    }
  );

  // buy nft
  const buyNFT = async () => {
    account != ""
      ? setShowPop(true)
      : account == ""
      ? toast({
          title: "Connect Wallet",
          status: "error",
          isClosable: true,
          position: "top-left",
        })
      : "";

    const balance = await web3?.eth.getBalance(account);
    const accountBalance = web3?.utils.fromWei(balance, "ether");

    setAccountBalance(accountBalance);
  };
  // offer nft
  const offerNFT = async () => {
    account == ""
      ? addToast({
          id: "connect-wallet-buy",
          message: "Connect Wallet",
          type: "error",
        })
      : account == NFTDetail.creator_id
      ? addToast({
          id: "connect-wallet-buy",
          message: "Owner cannot buy there own NFT",
          type: "error",
        })
      : setShowOfferPop(true);

    const balance = await web3?.eth.getBalance(account);
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    let wmaticBalance: any = await getBalance(web3, account);
    wmaticBalance = web3?.utils.fromWei(wmaticBalance?.amount, "ether");
    setWmaticBalance(wmaticBalance);
    setAccountBalance(accountBalance);
  };
  // convert matic to usd
  useEffect(() => {
    (async () => {
      if (NFTDetail !== null || NFTDetail !== undefined) {
        try {
          const nftPrice: number = NFTDetail?.price ? +NFTDetail?.price : 0;
          const nftMinPrice: number = NFTDetail?.min_price
            ? +NFTDetail?.min_price
            : 0;
          const maitccprice = await maticToUSD(nftPrice);
          const maitccMinprice = await maticToUSD(nftMinPrice);
          setUsdMinPriceMatic(maitccMinprice);
          setUsdMatic(maitccprice);
        } catch (e) {
          console.log(e, "consvertion error front-end");
        }
      }
    })();
  }, [NFTDetail]);

  // useEffect(() => {
  //   refetch();
  // }, [id]);

  return (
    <div className="bg-bg-1">
      {NFTDetail && (
        <div className="mx-auto max-h-full min-h-screen w-full max-w-[1400px]   px-4 pt-12 font-storeFont ">
          <div className=" mx-auto flex w-full max-w-7xl flex-col items-start  justify-between gap-4 sm:flex-row">
            {/* full nft image */}
            <div className="[min-w-[840px]]:mb-0  top-20  mb-4 h-full max-h-[500px] w-full max-w-xl md:sticky">
              <div className="h-[450px] w-full  sm:px-0">
                <Image
                  src={renderNFTImage(NFTDetail)}
                  alt="/nft"
                  width={500}
                  height={400}
                  priority
                  quality={100}
                  className="relative h-full  max-h-[500px] w-full  max-w-[700px] rounded-xl object-cover"
                />
              </div>
            </div>

            {/* nft full details */}
            <div className="w-full max-w-xl md:px-0">
              {/* intial details */}
              <p className="text-5xl capitalize">
                {NFTDetail.name}{" "}
                <span className="text-[20px] text-ac-2">
                  #{NFTDetail.token_id}
                </span>
              </p>
              <p className="text-md my-5 max-w-md justify-start text-tx-1">
                {NFTDetail.description}
              </p>

              {/* price and button */}
              <div className="rounded-[16px] border-2 border-tx-4 px-2 ">
                <div className="my-3 flex flex-col justify-between gap-2 md:flex-row">
                  {NFTDetail?.sell_type?.includes("fixed") && (
                    <div className="w-full rounded-md bg-white bg-opacity-20 p-2 backdrop-blur-lg backdrop-filter">
                      <p className="text-sm text-tx-5">Price</p>
                      <p>
                        <span className=" text-lg font-bold">
                          {NFTDetail?.price.toFixed(2)}{" "}
                        </span>

                        <span className="text-xs lowercase text-slate-500">
                          MATIC
                        </span>
                      </p>
                      <p>
                        <span className="text-xs lowercase text-slate-500">
                          $
                          {` ${(
                            +NFTDetail.price * (+maticToUsd as number)
                          ).toFixed(2)}`}
                        </span>
                      </p>
                    </div>
                  )}
                  {NFTDetail?.sell_type?.includes("offer") && (
                    <div className="w-full rounded-md bg-white bg-opacity-20 p-2 backdrop-blur-lg backdrop-filter">
                      <p className="text-sm text-tx-5">Highest Offer</p>
                      <p>
                        <span className=" text-lg font-bold">
                          {(+NFTDetail.highest_offer).toFixed(2)}{" "}
                        </span>

                        <span className="text-xs lowercase text-slate-500">
                          MATIC
                        </span>
                      </p>
                      <p>
                        <span className="text-xs lowercase text-slate-500">
                          $
                          {` ${(
                            +NFTDetail.min_price * (+maticToUsd as number)
                          ).toFixed(2)}`}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="mb-3 flex flex-col gap-2 md:flex-row">
                  {NFTDetail?.sell_type?.includes("fixed") && (
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
                  {NFTDetail?.sell_type?.includes("offer") && (
                    <button
                      type="button"
                      className="w-full rounded-3xl bg-bg-3 p-4 text-white hover:bg-bg-3/75"
                      onClick={(e) => {
                        e.preventDefault();
                        offerNFT();
                      }}
                    >
                      {NFTDetail.is_offered ? "Update Offer" : "Offer"}
                    </button>
                  )}

                  {showPop && NFTDetail && (
                    <Popup
                      open={showPop}
                      nft={NFTDetail}
                      setBuy={setShowPop}
                      price={+NFTDetail.price}
                      tax={+NFTDetail.tax}
                      accountBalance={+accountBalance}
                    />
                  )}
                  {/* {showOfferPop && (
                    <OfferPopUp
                      nft={NFTDetail}
                      open={showOfferPop}
                      setBuy={setShowOfferPop}
                      price={+NFTDetail.price}
                      tax={+NFTDetail.tax}
                      accountBalance={+accountBalance}
                    />
                  )} */}
                  {showOfferPop && (
                    <OfferPopUp
                      nft={NFTDetail}
                      open={showOfferPop}
                      setBuy={setShowOfferPop}
                      price={+NFTDetail.price}
                      tax={+NFTDetail.tax}
                      accountBalance={+accountBalance}
                      wmaticBalance={+wmaticBalance}
                    />
                  )}
                </div>
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
                      NFTDetail.sell_type.includes("offer")
                        ? " border-b-2 border-tx-2 "
                        : " !border-b-0"
                    }  `}
                  >
                    <h2>
                      <AccordionButton
                        _expanded={{ bg: "gray", color: "white" }}
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
                          <Link
                            href={`${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON}/address/${NFTDetail?.contract_address}`}
                            target="_blank"
                          >
                            <p className="hover:text-bg-2/80">
                              {customTruncateHandler(
                                NFTDetail?.contract_address
                              )}
                            </p>
                          </Link>
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
                          <p>{NFTDetail.token_id}</p>
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
                  {NFTDetail.sell_type.includes("offer") && (
                    <OfferList id={id} user={user} />
                  )}
                </Accordion>
              </div>
            </div>
          </div>

          {/* collection */}
          <CollectionList
            id={NFTDetail?.id}
            contract_id={NFTDetail?.contract_id}
            NFTCollection={NFTCollection?.data}
          />
        </div>
      )}
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
        <div className="  grid  h-full w-full grid-cols-1 gap-4 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 ">
          {NFTCollection.filter((list: any) => list?.id !== id)?.map(
            (collectionNFT: any, i: any) => (
              <NFTCard nft={collectionNFT} key={i} />
            )
          )}
        </div>
      </div>
    )
  );
};

const OfferList: any = ({ id, user }: any) => {
  const [offer, setOffer] = useState<any>([]);
  const [isModal, setIsModal] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedOffer, setSelectedOffer] = useState({});

  const [filter, setFilter] = useState({
    take: 5,
    skip: 0,
  });
  const { addToast } = CustomToast();

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
        }&nft_id=${id}&sell_type=offer&${new URLSearchParams(
          filter as any
        ).toString()}`
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
  const defaultModalParams = {
    selectedOffer,
    setSelectedOffer,
    refetch: NFTOfferRefetch,
  };
  const featureModalParams = {
    ...defaultModalParams,
    isModal,
    setIsModal,
    title,
  };
  useEffect(() => {
    NFTOfferRefetch();
  }, [filter?.take]);
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
      setTitle("Offer");
      setIsModal(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AccordionItem className="border-none">
      <h2>
        <AccordionButton _expanded={{ bg: "gray", color: "white" }}>
          <summary className="flex-1 cursor-pointer list-none items-center justify-between p-3 text-left font-medium">
            <span>NFT Offers</span>
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
                                    label={"Update Offer"}
                                    placement="left"
                                    className="w-full  font-normal  "
                                  >
                                    <div
                                      className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                      // onClick={() => handleUpdate(item)}
                                    >
                                      <i className="text-md fas fa-pen group-hover:text-boxdark cursor-pointer"></i>
                                    </div>
                                  </Tooltip>
                                </MenuItem>
                                <MenuItem p={0}>
                                  <Tooltip
                                    label={"Cancel Offer"}
                                    placement="left"
                                    className="w-full  font-normal  "
                                  >
                                    <div
                                      className=" group mx-auto flex cursor-pointer items-center  rounded-md p-2 text-center hover:bg-gray-200"
                                      onClick={() => cancelOffer(item)}
                                    >
                                      <i className="text-md fas fa-xmark group-hover:text-boxdark cursor-pointer"></i>
                                    </div>
                                  </Tooltip>
                                </MenuItem>
                              </MenuList>
                            </Portal>
                          </Menu>
                        </p>
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
              No Offers Yet!
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
      <UpdateModal {...featureModalParams} />
    </AccordionItem>
  );
};

NFTDetail.getIntialProps = async () => {
  const res = await websiteInfo();

  const json = await res?.json();
  return { navData: json.navData, webData: json.webData };
};
export default NFTDetail;
