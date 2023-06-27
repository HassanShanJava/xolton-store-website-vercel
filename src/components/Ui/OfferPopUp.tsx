import React, { useState } from "react";
// import { useToast } from "@chakra-ui/react";
// import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";
import {
  approvalWMATIC,
  maticDeposit,
} from "~/utils/web3/offer/wmaticFunction";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";
import { useForm } from "react-hook-form";
import { Input, NumberInput, NumberInputField } from "@chakra-ui/react";
import { customTruncateHandler } from "~/utils/helper";
import OfferSignModal from "../Modal/OfferSign";
import {
  finishNftOfferCreateProcess,
  setNftOfferCreateProcess,
} from "~/store/slices/offerSteps";
import { signSignature } from "~/utils/web3/offer/offerNft";
import NFTDetail from "../NFT/NFTDetail";

interface OfferPopUpType {
  open: boolean;
  setBuy: Function;
  price: number;
  tax: number;
  nft: any;
  accountBalance: number;
  wmaticBalance: number;
  id?: string;
  is_updated: boolean;
  refetch?: any;
}

const OfferPopUp = ({
  open,
  setBuy,
  nft,
  price,
  tax,
  accountBalance,
  wmaticBalance,
  id,
  is_updated,
  refetch,
}: OfferPopUpType) => {
  const { user }: any = useSelector((state: RootState) => state.user);
  console.log({ id }, "ididididid");

  const router = useRouter();
  const { handleSubmit, register, setValue, getValues } = useForm<any>();

  const [isPurchase, setIsPurchase] = useState<any>(""); //for loader
  const [isModal, setIsModal] = useState(false); //for loader
  const [inputOffer, setInputOffer] = useState("");
  const { addToast } = CustomToast();
  const offerUpload = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });

  const offerUpdate = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });
  const dispatch = useDispatch();

  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  const total_price = parseFloat(inputOffer) + 0.02 * parseFloat(inputOffer);

  // offer modal steps content
  const offerStepsData = [
    {
      heading: "Conversion",
      text: "Send transaction to convert to wrapped token.",
    },
    {
      heading: "Approve",
      text: "This transaction is only conducted once.",
    },

    {
      heading: "Signature",
      text: "Sign the message to place your offer on this NFT.",
    },
  ];

  // step 3
  const signature = async () => {
    console.log("NFT :: ", nft);

    const sign_payload = {
      nftContract: nft.store_makerorder?.nftContract,
      nftOwner: nft.store_makerorder?.signer,
      signer: account,
      baseAccount: nft.store_makerorder?.baseAccount,
      tokenId: nft.store_makerorder?.tokenId,
      sign_price: parseFloat(inputOffer).toFixed(5),
    };

    console.log({ sign_payload }, "sign_payload");

    const signature_result = await signSignature(sign_payload, web3);
    if (signature_result?.success) {
      return signature_result;
    } else {
      return signature_result;
    }
  };

  // step 2
  const approval = async () => {
    const aproval_result = await approvalWMATIC(web3, account, total_price);
    if (aproval_result.success) {
      dispatch(setNftOfferCreateProcess(3)); //signature
      const signature_data = await signature();
      if (signature_data?.success) {
        return { ...signature_data, ...aproval_result };
      } else {
        throw new Error(aproval_result?.msg);
      }
    } else {
      throw new Error(aproval_result?.msg);
    }
  };

  // step 1
  const offerNFT = async (e: any) => {
    e.preventDefault();
    dispatch(setNftOfferCreateProcess(1)); //conversion

    if (wmaticBalance >= total_price) {
      setIsModal(true); //true
      dispatch(setNftOfferCreateProcess(2)); //aproval
      try {
        const data: any = await approval();
        const signature = data?.sign.substring(2);

        const payload: any = {
          store_id: process.env.NEXT_PUBLIC_STORE_ID,
          nft_id: nft?._id.$oid,
          offer_amount: +inputOffer,
          store_customer_id: user?.id,
          sell_type: "offer",
          is_order_ask: true,
          nft_owner: nft.store_makerorder?.signer,
          base_account: nft.store_makerorder?.baseAccount,
          nft_contract: nft.store_makerorder?.nftContract,
          signer: account,
          tokenId: nft?.store_makerorder?.tokenId,
          tax: +((2 / 100) * +inputOffer),
          nonce: data?.nonce?.toString() || "",
          signed_v: parseInt(signature.substring(128, 130), 16).toString(),
          signed_r: "0x" + signature.substring(0, 64),
          signed_s: "0x" + signature.substring(64, 128),
        };

        let response;
        if (is_updated) {
          console.log({ id, offer_id: id, ...payload }, "offer update");
          response = await offerUpdate.mutateAsync({
            // offer_id: id,
            ...payload,
          });
        } else {
          console.log({ payload }, "offer create ");
          response = await offerUpload.mutateAsync(payload);
        }

        if (response.success) {
          setBuy(false);
          refetch();
          dispatch(finishNftOfferCreateProcess()); //finish ofer
          //false conver first

          addToast({
            id: "offer-error",
            message: is_updated
              ? "Your Offer Updated Successfully!"
              : "Your Offer Uploaded Successfully!",

            type: "success",
          });
          // refetch();
        } else {
          setBuy(false);
          dispatch(finishNftOfferCreateProcess()); //finish ofer
          throw new Error(response.message);
        }
      } catch (e: any) {
        console.log("error: ", { e });
        setBuy(false);
        dispatch(finishNftOfferCreateProcess()); //false conver first

        addToast({
          id: "offer-error",
          message: e?.message,
          type: "error",
        });
      }
    } else if (wmaticBalance + accountBalance >= total_price) {
      setIsModal(true);
      dispatch(setNftOfferCreateProcess(1)); //false conver first
      const remainbalance: any = total_price - wmaticBalance;
      console.log({ remainbalance }, "remainbalance");

      const result = await maticDeposit(web3, account, remainbalance);

      if (result.success) {
        dispatch(setNftOfferCreateProcess(2)); //false conver first
        try {
          const data = await approval();
          console.log(data, "offer");
          const signature = data?.sign.substring(2);

          const payload: any = {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
            nft_id: nft?.id,
            offer_amount: +inputOffer,
            store_customer_id: user?.id,
            sell_type: "offer",
            // sell_type: "fixed-offer",
            is_order_ask: true,
            nft_owner: nft.store_makerorder?.signer,
            base_account: nft.store_makerorder?.baseAccount,
            nft_contract: nft.store_makerorder?.nftContract,
            signer: account,
            tokenId: nft?.store_makerorder?.tokenId,
            tax: +((2 / 100) * +inputOffer).toFixed(5),
            nonce: data?.nonce?.toString() || "",
            signed_v: parseInt(signature.substring(128, 130), 16).toString(),
            signed_r: "0x" + signature.substring(0, 64),
            signed_s: "0x" + signature.substring(64, 128),
          };

          let response;
          if (is_updated) {
            console.log({ id }, "update bro");
            response = await offerUpdate.mutateAsync({
              // offer_id: id,
              ...payload,
            });
          } else {
            console.log({ payload }, "payload creareted");
            response = await offerUpload.mutateAsync(payload);
          }

          if (response.success) {
            setBuy(false);
            refetch();
            dispatch(finishNftOfferCreateProcess()); //finish ofer
            //false conver first

            addToast({
              id: "offer-error",
              message: is_updated
                ? "Your Offer Updated Successfully!"
                : "Your Offer Uploaded Successfully!",
              type: "success",
            });
          } else {
            setBuy(false);
            dispatch(finishNftOfferCreateProcess()); //false conver first
            throw new Error(response.message);
          }
        } catch (e: any) {
          console.log("error message: ", { e });
          setBuy(false);
          dispatch(finishNftOfferCreateProcess()); //false conver first

          addToast({
            id: "offer-error",
            message: e?.message,
            type: "error",
          });
        }
        // const aproval_result
      } else {
        dispatch(finishNftOfferCreateProcess()); //false conver first

        addToast({
          id: "offer-error",
          message: result?.msg,
        });
      }
    } else {
      addToast({
        id: "transaction-id",
        message: "Not Enough Balance",
        type: "error",
      });
      return;
    }
  };

  const offerdetails = [
    {
      title: "Min Price:",
      values: nft?.highest_offer
        ? (nft?.highest_offer + 0.1 * nft?.highest_offer).toFixed(5)
        : (nft?.min_price).toFixed(5),
      symbol: "matic",
    },
    {
      title: "Your balance",
      values: (+accountBalance).toFixed(5),
      symbol: "matic",
    },
    {
      title: "Your Wmatic balance",
      values: (+wmaticBalance).toFixed(5),
      symbol: "wmatic",
    },
    {
      title: "Service fee 2%",
      values: inputOffer
        ? (0.02 * Number(inputOffer)).toFixed(5) //2% tax included
        : (0).toFixed(5),
      symbol: "matic",
    },
    {
      title: "You will pay",
      values: total_price ? total_price.toFixed(5) : (0).toFixed(5),
      symbol: "matic",
    },
  ];

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

                <form
                  onSubmit={(e) => {
                    offerNFT(e);
                  }}
                >
                  <div className="m-4">
                    <Input
                      placeholder="Offer Price"
                      defaultValue={
                        nft.is_offered
                          ? nft?.highest_offer + 0.1 * nft?.highest_offer //10% higher than previous highest bid
                          : null
                      }
                      min={
                        nft.highest_offer
                          ? nft?.highest_offer + 0.1 * nft?.highest_offer
                          : nft?.min_price
                      }
                      type="number"
                      step={"any"}
                      required
                      maxLength={2}
                      onChange={(e) => setInputOffer(e.target.value)}
                    />
                  </div>
                  {offerdetails.map((item, i) => (
                    <div key={i} className="mx-3   p-1 ">
                      <div className="relative flex items-center justify-between ">
                        <p className=" text-md leading-relaxed text-slate-500">
                          {item.title}
                        </p>
                        <p className=" text-md leading-relaxed text-slate-500">
                          {item.values}{" "}
                          <span className="text-xs lowercase">
                            {item.symbol}
                          </span>
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
      <OfferSignModal
        modalState={isModal}
        title={"Place Offer for NFT"}
        setModalState={setIsModal}
        offerStepsData={offerStepsData}
        type={"offerNft"}
      />
    </>
  );
};

export default OfferPopUp;
