import React, { useState } from "react";
import { Input, InputGroup, useToast } from "@chakra-ui/react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import { initWeb3 } from "~/utils/web3/web3Init";
import { CustomToast } from "../globalToast";

const NewUser = ({ open, setOpen }: { open: boolean; setOpen: Function }) => {
  const { addToast } = CustomToast();
  const [isLoading, setLoading]=useState(false)
  const dispatch = useDispatch();
  return (
    <div>
      {open ? (
        <>
          {/* overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-full  max-w-[450px] px-4 ">
              {/*content*/}
              <div className="relative flex  w-full flex-col rounded-lg border-0 bg-white  shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="mb-5 flex w-full items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-3xl ">Your Almost There!</h2>
                    <h2 className="text-md mt-4 text-gray-800">
                      Choose a display name and enter your email address to
                      receive updates when your NFTs sell or receive offers.
                    </h2>
                  </div>
                  {/*Close button  */}

                  {/* <div
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                    className="my-auto "
                  >
                    <i className="fa-regular fa-circle-xmark cursor-pointer text-2xl hover:text-gray-600"></i>
                  </div> */}
                </div>

                {/*body*/}
                <div className="flex w-full flex-col items-center gap-y-5 px-5">
                  <InputGroup>
                    <Input type="text" placeholder="Display Name" />
                  </InputGroup>

                  <InputGroup>
                    <Input type="email" placeholder="Display Email" />
                  </InputGroup>
                </div>
                {/*footer*/}
                <div className="mt-4 flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="mb-1 mr-1 w-full rounded bg-bg-3 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      setLoading(true)
                      let data: any = await initWeb3();
                      if (data?.success !== false) {
                        addToast({
                          id: "connect-wallet",
                          message: "Wallet connected",
                          type: "success",
                        });

                        dispatch(
                          web3Init({
                            web3: data?.web3,
                            account: data?.account,
                            chainId: data?.chainId,
                          })
                        );
                      } else {
                        data && data.message.message
                          ? addToast({
                              id: "connect-wallet",
                              message: data.message.message,
                              type: "error",
                              position: "top-right",
                            })
                          : addToast({
                              id: "connect-wallet",
                              message: data.message,
                              type: "error",
                              position: "top-right",
                            });
                      }
                      setOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    {!isLoading ? (
                      "Connect"
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
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default NewUser;
