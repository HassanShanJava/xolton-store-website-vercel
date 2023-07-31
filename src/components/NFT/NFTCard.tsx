import Image from "next/image";
import React, { useEffect, useState } from "react";

import Popup from "../Ui/Popup";

import { customTruncateHandler, renderNFTImage } from "~/utils/helper";

import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import Web3 from "web3";
import { initWeb3 } from "~/utils/web3/web3Init";
import { RootState } from "~/store/store";
import { Tag, TagLabel, Tooltip, useToast } from "@chakra-ui/react";

import Link from "next/link";
import { CustomToast } from "../globalToast";
import OfferPopUp from "../Ui/OfferPopUp";
import { getBalance } from "~/utils/web3/offer/wmaticFunction";
import { useQuery } from "@tanstack/react-query";

const NFTCard = ({ nft, refetch, is_purchase, ...payload }: any) => {
  const [showPop, setShowPop] = useState(false);
  const [showStripePop, setShowStripePop] = useState(false);
  const [showOfferPop, setShowOfferPop] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [wmaticBalance, setWmaticBalance] = useState("");
  const [updateOffer, setUpdateOffer] = useState(""); //offer id

  // const toast = useToast();
  const { addToast } = CustomToast();
  const { user }: any = useSelector((state: RootState) => state.user);
  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  const [filter, setFilter] = useState({
    take: 5,
    skip: 0,
  });
  const [offer, setOffer] = useState<any>([]);
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
        }&nft_id=${nft._id.$oid}&sell_type=offer&${new URLSearchParams(
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
      enabled: nft._id.$oid ? true : false,
    }
  );

  const buyNFT = async () => {
    account == ""
      ? addToast({
          id: "connect-wallet-buy",
          message: "Connect Wallet",
          type: "error",
        })
      : user !== null && user?.wallet_address !== nft?.owner_id
      ? setShowPop(true)
      : account == nft.creator_id ||
        account == nft?.store_makerorder?.baseAccount
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
  console.log({ nft });

  const offerNFT = async (offerid?: any) => {
    if (account === null || account === "") {
      addToast({
        id: "connect-wallet-buy",
        message: "Connect Wallet",
        type: "error",
      });
    } else if (
      account == nft?.creator_id ||
      account == nft?.store_makerorder?.baseAccount
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
  const listNft = () => {
    payload.setOpenListing(true);
    payload.setSelectNftListing({
      ...nft,
      accountBalance,
      wmaticBalance,
    });
  };
  const updateNft = () => {
    payload.setIsModal(true);
    payload.setTitle("Unlist");
    payload.setSelectNftListing({
      ...nft,
      accountBalance,
      wmaticBalance,
    });
  };

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate: any = nft?.end_date && new Date();
  const secondDate: any = nft?.end_date && new Date(nft?.end_date?.$date);

  const diffDays =
    nft?.end_date &&
    Math.ceil((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  console.log({ diffDays });
  return (
    <>
      <div className=" group mx-auto h-auto w-full  max-w-[350px]   rounded-[20px] bg-[#fafafa] p-3 hover:bg-white">
        <a
          href={
            !is_purchase
              ? `/nft-details/${nft._id.$oid}${
                  process.env.NEXT_PUBLIC_ENV !== "DEV" ? ".html" : ""
                }`
              : "#"
          }
        >
          <div className={" relative h-80 max-h-[290px]  w-full "}>
            <Image
              src={renderNFTImage(nft)}
              alt="/nft"
              fill
              priority
              quality={100}
              className="mx-auto rounded-xl  object-cover  object-center"
            />
            {nft?.sell_type?.includes("-auction") && diffDays > 0 && (
              <div className="absolute bottom-2 w-full pl-2 pr-2 opacity-0 transition duration-75 ease-in-out  group-hover:opacity-100 ">
                <div className=" z-50  flex w-fit flex-col items-center  justify-end rounded-md bg-white pb-1 pl-2 pr-2 pt-1    opacity-70">
                  <span className="text-xs">Days Left</span>
                  <span className="text-sm  font-bold">{diffDays}</span>
                </div>
              </div>
            )}
          </div>
        </a>

        <div className="">
          <div className="flex items-center justify-between px-2.5 py-4">
            {nft?.name && (nft?.name).length > 15 ? (
              <Tooltip label={nft?.name} placement="bottom-start">
                <p className="capitalize">
                  {customTruncateHandler(nft?.name, 15)}
                </p>
              </Tooltip>
            ) : (
              <p className="capitalize">{nft?.name}</p>
            )}

            <p>
              {nft?.price > 0 ? (
                <>
                  {nft?.price} <span className="text-xs lowercase">MATIC</span>
                </>
              ) : (
                <>
                  <Tag size="sm" colorScheme="red" borderRadius="full">
                    <TagLabel>Not Listed</TagLabel>
                  </Tag>
                </>
              )}
              {/* {nft?.sell_type?.includes("offer") ? nft?.min_price : nft?.price}{" "} */}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 px-2">
            {!is_purchase &&
            (user == null || user?.id !== nft?.store_customer_id?.$oid) ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    buyNFT();
                  }}
                  className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                >
                  Buy
                </button>

                {nft?.sell_type?.includes("-offer") && !nft?.is_offered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      offerNFT();
                    }}
                    className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                  >
                    Offer Now
                  </button>
                )}
                {nft?.sell_type?.includes("-auction") && diffDays > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      offerNFT();
                    }}
                    className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                  >
                    {!nft?.is_offered ? "Bid Now" : "Update Bid"}
                  </button>
                )}
                {nft?.sell_type?.includes("fixed-offer") && nft?.is_offered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      offerNFT();
                    }}
                    className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                  >
                    Update Offer
                  </button>
                )}
              </>
            ) : is_purchase &&
              (user != null || user?.id === nft?.store_customer_id?.$oid) ? (
              <>
                {!nft?.is_listed ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        listNft();
                      }}
                      className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                    >
                      List NFT
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        updateNft();
                      }}
                      className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                    >
                      Un List NFT
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={true}
                  className="w-full  rounded-[6px] bg-bg-3 py-3 text-center font-storeFont text-white hover:bg-bg-3/75 "
                >
                  Already Owned
                </button>
              </>
            )}

            {showPop && (
              <Popup
                nft={nft}
                open={showPop}
                setBuy={setShowPop}
                // showStripePop={showStripePop}
                // setShowStripePop={setShowStripePop}
                price={+nft.price}
                tax={+nft.tax}
                accountBalance={+accountBalance}
                setAccountBalance={setAccountBalance}
                refetch={refetch}
              />
            )}
            {showOfferPop && (
              <OfferPopUp
                nft={nft}
                open={showOfferPop}
                setBuy={setShowOfferPop}
                price={+nft.price}
                tax={+nft.tax}
                accountBalance={+accountBalance}
                wmaticBalance={+wmaticBalance}
                id={updateOffer}
                is_updated={nft?.is_offered ? true : false}
                is_offer={nft?.sell_type?.includes("auction") ? false : true}
                setAccountBalance={setAccountBalance}
                refetch={refetch}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTCard;
