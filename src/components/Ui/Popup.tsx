import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";

interface PopUpType{
  open:boolean,
  setBuy:Function,
  price:number,
  tax:number,
  nft:any,
  accountBalance:number
}

const Popup = ({ open, setBuy,nft, price, tax, accountBalance }:PopUpType) => {
  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state:any) => state.web3);
  console.log("NFT Tax L: ",tax)
  const total = (+price + +tax).toFixed(5);
  console.log("Price :: ",price)
  console.log("Total :: ",total)
  const purchaseNFT = async() => {
    if (accountBalance < total) {
      toast({
        title: "Not Enough Balance",
        status: "error",
        isClosable: true,
        position: "top-right",
      });
      return ;
    } else{
      console.log("NFT OO ",nft)
      console.log("WEB3 NFT : ",nft?.store_makerorder[0])
      const buyData = await buyNFT(web3,account,total,nft?.store_makerorder[0])
      if (buyData?.success){
        console.log("BUY DATA :: ",buyData)
        toast({
          title: "Transaction Completed",
          status: "success",
          isClosable: true,
          position: "top-right",
        });
      } else {
        console.log("BUY Error :",buyData)
        toast({
          title: buyData.msg as string,
          status: "error",
          isClosable: true,
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      {open ? (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6  w-full max-w-[450px] ">
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
                    <i className="fa-regular fa-circle-xmark cursor-pointer text-2xl hover:text-gray-600"></i>
                  </div>
                </div>
                {/*body*/}

                <div className="m-6 rounded-xl  border border-slate-500 p-3 ">
                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      Your balance
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+accountBalance).toFixed(5)} Eth
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      NFT Price
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+price).toFixed(5)} Eth
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      Service fee 2%
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {(+tax).toFixed(5)} Eth
                    </p>
                  </div>

                  <div className="relative flex items-center justify-between ">
                    <p className=" text-md leading-relaxed text-slate-500">
                      You will pay
                    </p>
                    <p className=" text-md leading-relaxed text-slate-500">
                      {total} Eth
                    </p>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="mb-1 mr-1 w-full rounded bg-accentLinear-1 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={purchaseNFT}
                  >
                    Purchase
                  </button>
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
