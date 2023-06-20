import React, { useState } from "react";
// import { useToast } from "@chakra-ui/react";
// import Web3 from "web3";
import { useSelector } from "react-redux";

import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";

import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";
import { useForm } from "react-hook-form";
import { Input, NumberInput, NumberInputField } from "@chakra-ui/react";
import { customTruncateHandler } from "~/utils/helper";

interface OfferPopUpType {
  open: boolean;
  setBuy: Function;
  price: number;
  tax: number;
  nft: any;
  accountBalance: number;
}

const OfferPopUp = ({
  open,
  setBuy,
  nft,
  price,
  tax,
  accountBalance,
}: OfferPopUpType) => {
  const router = useRouter();
  const { handleSubmit, register, setValue, getValues } = useForm<any>();

  const [isPurchase, setIsPurchase] = useState<any>("");
  const [inputOffer, setInputOffer] = useState("");
  const { addToast } = CustomToast();

  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  

  const total_price = parseFloat(inputOffer) + 0.02 * parseFloat(inputOffer);

  const offerNFT = async (values: any) => {
    if (accountBalance < total_price) {
      addToast({
        id: "transaction-id",
        message: "Not Enough Balance",
        type: "error",
      });
      return;
    } else {
      setIsPurchase(false);

      // const buyData = await buyNFT(
      //   web3,
      //   account,
      //   total_price,
      //   nft?.store_makerorder[0]
      // );

      if (true) {
        // console.log("PAYLOAD :: ",{ buyData.owner,buyData.transaction_id, nft.id,  })

        const payload: any = {
          id: nft.id,
          owner: "",
          transaction_id: "buyData.transaction_id",
          status: "Purchase",
          store_id: process.env.NEXT_PUBLIC_STORE_ID,
        };

        // const payloadOrder: any = {
        //   store_id: nft.store_id,
        //   nft_id: nft.id,
        //   owner_address: buyData?.owner,
        //   transaction_id: buyData?.transaction_id,
        //   nft_name: nft.name,
        //   total_amount: total, // 2.04
        //   net_amount: total_price - 2 * +nft.tax, // 1.96
        //   total_tax: 2 * +nft.tax, // 0.08
        //   sell_type: "fixed",
        //   previous_owner_address: buyData?.previous_owner,
        // };

        // const data = await nftUpdate.mutateAsync(payload);
        // const dataOrder = await nftOrder.mutateAsync(payloadOrder);

        addToast({
          id: "transaction-id",
          message: "Transaction Completed",
          type: "success",
        });

        setIsPurchase(true);
        setBuy(false);
        router.push("/");
      } else {
        addToast({
          id: "transaction-id",
          message: "issue on buy nft" as string,
          type: "error",
        });

        setBuy(false);
        router.push("/");
      }
    }
  };

  const offerdetails=[
    {
      title:"Your balance",
      values:(+accountBalance).toFixed(5),
      symbol:"matic"
    },
    {
      title:"Your Wmatic balance",
      values:(+accountBalance).toFixed(5),
      symbol:"wmatic"
    },
    {
      title:"Service fee 2%",
      values:inputOffer
      ? (0.02 * Number(inputOffer)).toFixed(5)
      : (0).toFixed(5),
      symbol:"matic"
    },
    {
      title:"You will pay",
      values:total_price ? total_price.toFixed(5) : (0).toFixed(5),
      symbol:"matic"
    },
  ]
  

  return (
    <>
      {open ? (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6  w-full max-w-[350px] ">
              {/*content*/}
              <div className="relative flex  w-full flex-col rounded-lg border-0 bg-white  shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="mb-3 flex w-full items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl ">Place an Offer</h3>
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

                <form onSubmit={handleSubmit(offerNFT)}>
                  <div className="m-4">
                    <NumberInput
                      min={nft.min_price ? nft.min_price : 0}
                      >
                      <NumberInputField
                        placeholder="Offer Price"
                        required
                        
                        max={nft.max_price ? nft.max_price : 50}
                        onChange={(e) => setInputOffer(e.target.value)}
                      />
                    </NumberInput>

                  </div>
                  {offerdetails.map((item,i)=>(
                    <div key={i} className="mx-3   p-1 ">
                    <div className="relative flex items-center justify-between ">
                      <p className=" text-md leading-relaxed text-slate-500">
                        {item.title}
                      </p>
                      <p className=" text-md leading-relaxed text-slate-500">
                        {item.values}{" "}
                        <span className="text-xs lowercase">{item.symbol}</span>
                      </p>
                    </div>
                    
                  
                  </div>
                  ))}
                  {/*footer*/}
                  <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                    <button
                      className="mb-1 mr-1 w-full rounded bg-bg-3 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="submit"
                      disabled={isPurchase}
                    >
                      {isPurchase !== false ? (
                        "OFFER NOW"
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
                  </div>
                </form>
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

export default OfferPopUp;
