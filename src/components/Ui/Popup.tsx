import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

import { checkTargetForNewValues } from "framer-motion";

import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";
// import { customTruncateHandler } from "~/utils/helper";
import { StripeModal } from "./stripeModal";
import { customTruncateHandler, renderNFTImage } from "~/utils/helper";
import Image from "next/image";
interface PopUpType {
  open: boolean;
  setBuy: Function;
  price: number;
  tax: number;
  nft: any;
  accountBalance: number;
  setAccountBalance?: any;
  refetch?: any;
}

const Popup = ({
  open,
  setBuy,
  nft,
  price,
  tax,
  accountBalance,
  setAccountBalance,
  refetch,
}: PopUpType) => {
  const router = useRouter();
  const {
    data: Stripetoken,
    isLoading,
    isFetched,
    refetch: TokenRefetch,
  } = useQuery(
    ["tokenApi"],
    async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/key?store_id=${process.env.NEXT_PUBLIC_STORE_ID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data?.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const [isPurchase, setIsPurchase] = useState<any>("");
  const { addToast } = CustomToast();

  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  const total: any = Number(+price + +tax);

  const nftUpdate = useMutation({
    mutationFn: (newTodo) => {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/nft`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo), // body data type must match "Content-Type" header
      });
    },
  });

  const nftOrder = useMutation({
    mutationFn: (newTodo) => {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-nft`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo), // body data type must match "Content-Type" header
      });
    },
  });

  const purchaseNFT = async () => {
    if (accountBalance < total) {
      addToast({
        id: "transaction-id",
        message: "Not Enough Balance",
        type: "error",
      });
      return;
    } else {
      setIsPurchase(false);

      const buyData = await buyNFT(web3, account, total, nft?.store_makerorder);

      console.log(nft?.store_makerorder, { nft }, "nft payload");
      if (buyData?.success) {
        // console.log("PAYLOAD :: ",{ buyData.owner,buyData.transaction_id, nft.id,  })

        const payload: any = {
          id: nft._id.$oid,
          owner: buyData.owner,
          transaction_id: buyData.transaction_id,
          is_listed: false,
          status: "Purchase",
          store_id: process.env.NEXT_PUBLIC_STORE_ID,
        };

        const payloadOrder: any = {
          store_id: nft.store_id.$oid,
          nft_id: nft._id.$oid,
          owner_address: buyData?.owner,
          transaction_id: buyData?.transaction_id,
          nft_name: nft.name,
          total_amount: total, // 2.04
          net_amount: total - 2 * +nft.tax, // 1.96
          total_tax: 2 * +nft.tax, // 0.08
          sell_type: "fixed",
          previous_owner_address: buyData?.previous_owner,
        };

        const data = await nftUpdate.mutateAsync(payload);
        const dataOrder = await nftOrder.mutateAsync(payloadOrder);

        addToast({
          id: "transaction-id",
          message: "Transaction Completed",
          type: "success",
        });

        refetch();
        setIsPurchase(true);
        setBuy(false);
      } else {
        addToast({
          id: "transaction-id",
          message: buyData.msg as string,
          type: "error",
        });

        setBuy(false);
        router.push("/");
      }
    }
  };
  const featureModelParam: any = {
    open,
    setBuy,
    price,
    account,
    refetch,
    setAccountBalance,
  };
  const stripePromise =
    !isLoading && isFetched && Stripetoken?.public_key
      ? loadStripe(Stripetoken?.public_key as string)
      : null;

  return (
    <>
      {open ? (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur focus:outline-none">
            <div className="relative mx-auto my-6  w-full max-w-[350px] ">
              {/*content*/}
              <div className="relative flex  w-full flex-col rounded-lg border-0 bg-white  shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="mb-5 flex w-full items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl ">Checkout</h3>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setBuy(false);
                    }}
                    className="my-auto "
                  >
                    <i className="fas fa-xmark cursor-pointer text-2xl hover:text-gray-600"></i>
                  </div>
                </div>
                {/*body*/}
                <div className="mx-3 p-3">
                  <div className="flex items-center justify-center gap-3 rounded-full border border-gray-700 p-4">
                    {/* eth logo */}
                    <div className="flex items-center rounded-full bg-gray-300">
                      <i className="fa-brands fa-ethereum h-8 w-8 py-1.5 text-center "></i>
                    </div>

                    {/* account */}
                    <p>{customTruncateHandler(account, 15)}</p>

                    {/* connected */}
                    <div className="rounded-3xl bg-green-200 p-0.5 text-center">
                      <p className="px-1 text-[10px] text-green-900">
                        Connected
                      </p>
                    </div>
                  </div>
                </div>
                {/* nft detail */}
                <div className="mx-3 p-3">
                  <div className="flex items-center justify-start gap-3 rounded-xl border border-gray-700 p-2">
                    <div className="relative h-20 w-16">
                      <Image
                        src={renderNFTImage(nft)}
                        alt="/"
                        fill
                        priority
                        quality={100}
                        className="mx-auto rounded-xl "
                      />
                    </div>
                    <div >
                      <p className="font-bold">NFT Info</p>
                      <p>{nft.name}</p>
                      <p className="text-xs">
                        {customTruncateHandler(nft.creator_id, 20)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="m-6 rounded-xl  border border-slate-500 p-3 ">
                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      Your balance
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+accountBalance).toFixed(5)}{" "}
                      <span className="text-xs lowercase">MATIC</span>
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      NFT Price
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+price).toFixed(5)}{" "}
                      <span className="text-xs lowercase">MATIC</span>
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      Service fee 2%
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+tax).toFixed(5)}{" "}
                      <span className="text-xs lowercase">MATIC</span>
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      You will pay
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {total.toFixed(5)}{" "}
                      <span className="text-xs lowercase">MATIC</span>
                    </p>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex flex-col items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="mb-1 mr-1 w-full rounded bg-bg-3 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={purchaseNFT}
                    disabled={isPurchase}
                  >
                    {isPurchase !== false ? (
                      "Purchase"
                    ) : (
                      <>
                        <div className="flex items-center justify-center py-1.5">
                          <div className="progress"></div>
                          <div className="progress"></div>
                          <div className="progress"></div>
                          <div className="progress"></div>
                        </div>
                      </>
                    )}
                  </button>
                  {+accountBalance < +price &&
                    isFetched &&
                    !isLoading &&
                    Stripetoken && (
                      <>
                        <Elements stripe={stripePromise}>
                          <StripeModal {...featureModelParam} />
                        </Elements>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Popup;
