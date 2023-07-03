import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import MetaFox from "../../public/images/MetaMask_Fox.png";
import MaticLogo from "../../public/images/polygon.png";
import WmaticLogo from "../../public/images/Wmatic.png";

import Logo from "../../public/images/logo.png";
import MenuIcon from "../../public/icons/hamburger.svg";
import Link from "next/link";
import {
  customTruncateHandler,
  getCustomerConnectInfo,
  loginConnectInfo,
  maticToUSD,
  renderNFTIcon,
} from "~/utils/helper";
import { web3Init } from "~/store/slices/web3Slice";
import { initWeb3 } from "~/utils/web3/web3Init";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { Button, Input, useDisclosure, useToast } from "@chakra-ui/react";
import { setAccount } from "~/store/slices/web3Slice";

import { storeWebPageData } from "~/store/slices/pageSlice";
import { storeWebThemeData } from "~/store/slices/themeSlice";
import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";
import NewUser from "../Ui/NewUser";
import { setUserProcess } from "~/store/slices/authSlice";
import { setMaticToUsdProcess } from "~/store/slices/maticSlice";
import Web3 from "web3";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { getBalance } from "~/utils/web3/offer/wmaticFunction";

const Navbar = ({ navData: navprops, webData: webprops }: any) => {
  const [nav, setNav] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const handleNav = () => setNav(!nav);
  const dispatch = useDispatch();
  const { addToast } = CustomToast();
  useEffect(() => {
    (async () => {
      try {
        const localStore: any = localStorage.getItem("store_customer");
        console.log(localStore, "localStore");
        if (localStore !== null) {
          let store = JSON.parse(localStore ? localStore : "");
          if (store !== undefined) {
            dispatch(setUserProcess(store));
            const web3 = new Web3(window.ethereum);

            let account = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            console.log("Account : ", account);
            console.log("localStore?.wallet_address : ", store?.wallet_address);

            if (
              account[0]?.toLowerCase() === store?.wallet_address?.toLowerCase()
            ) {
              account = account[0];
              const chainId = await window.ethereum.request({
                method: "eth_chainId",
              });

              console.log("If Condition configWeb3");
              dispatch(
                web3Init({
                  web3: web3,
                  account: account,
                  chainId: chainId,
                })
              );

              return { account, web3 };
            } else {
              console.log("ERROR");
              console.log("ELSE Condition configWeb3");
              localStorage.removeItem("store_customer");

              dispatch(
                web3Init({
                  web3: null,
                  account: "",
                  chainId: "",
                })
              );

              // return thunkApi.rejectWithValue("You are disconnected");
            }
          }
        }
      } catch (err) {
        console.log("ERROR");
        console.log(err);
      }
    })();
  }, [typeof window !== "undefined", dispatch]);
  useEffect(() => {
    (async () => {
      try {
        const nftPrice: number = 1;

        const maitccprice = await maticToUSD(nftPrice);
        console.log({ maitccprice });
        dispatch(setMaticToUsdProcess(maitccprice));
      } catch (e) {
        console.log(e, "consvertion error front-end");
      }
    })();
  }, []);

  const { account } = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);
  const { chainId } = useSelector((state: any) => state.web3);
  const { user } = useSelector((state: RootState) => state.user);
  const { maticToUsd } = useSelector((state: RootState) => state.matic);

  const loginConnect = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store-customer/login`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });

  // connect wallet
  const connectMetamask = async () => {
    //

    try {
      let data: any = await initWeb3();

      const payload: any = {
        store_id: process.env.NEXT_PUBLIC_STORE_ID,
        wallet_address: data?.account,
      };

      const response = await loginConnect.mutateAsync(payload);

      console.log(response?.storeCustomer, { response }, "response");
      if (response?.data === null) {
        setShowPop(true);
      } else {
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

          localStorage.setItem(
            "store_customer",
            JSON.stringify(response.storeCustomer)
          );
          dispatch(setUserProcess(response.storeCustomer));
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
        dispatch(
          web3Init({
            web3: data?.web3,
            account: data?.account,
            chainId: data?.chainId,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (typeof window !== "undefined") {
    window?.ethereum?.on("accountsChanged", async function (accounts: String) {
      if (account !== "") {
        const payload: any = {
          store_id: process.env.NEXT_PUBLIC_STORE_ID,
          wallet_address: accounts[0],
        };

        const changed_response = await loginConnect.mutateAsync(payload);
        console.log({ changed_response });
        if (changed_response?.storeCustomer === null) {
          setShowPop(true);
        } else {
          dispatch(setAccount(accounts[0]));
          console.log(changed_response.store_customer);
          localStorage.setItem(
            "store_customer",
            JSON.stringify(changed_response.storeCustomer)
          );

          dispatch(setUserProcess(changed_response.storeCustomer));
          addToast({
            id: "acc-changed",
            type: "success",
            message: "Account Changed!",
          });
        }
      }
    });

    window?.ethereum?.on("chainChanged", function (chainId: String) {
      if (chainId != "0x13881") {
        dispatch(setAccount(""));
      }
    });
  }

  const openUserDrawer = async () => {
    const balance = await web3?.eth.getBalance(account);
    const accountBalance = web3?.utils.fromWei(balance, "ether");
    let wmaticBalance: any = await getBalance(web3, account);
    wmaticBalance = web3?.utils.fromWei(wmaticBalance?.amount, "ether");

    console.log({ wmaticBalance, chainId });

    setUserInfo({
      ...user,
      chainId,
      wmaticBalance: parseFloat(wmaticBalance).toFixed(3),
      accountBalance: parseFloat(accountBalance).toFixed(3),
      maticUSD: (parseFloat(maticToUsd) * parseFloat(accountBalance)).toFixed(
        3
      ),
      wmaticUSD: (parseFloat(maticToUsd) * parseFloat(wmaticBalance)).toFixed(
        3
      ),
    });

    onOpen();
  };

  return (
    <>
      {/* for mobile menu state */}
      <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-bg-2 p-2 shadow-md">
        <div className=" sm:hidden" onClick={handleNav}>
          {nav ? (
            <div className="fixed left-0 top-0 z-10 h-screen w-full bg-black/80"></div>
          ) : (
            <div className="relative  flex h-8 w-8 ">
              <Image
                src={MenuIcon}
                alt="/logo"
                fill
                priority
                className="cursor-pointer rounded-xl bg-white"
              />
            </div>
          )}
        </div>

        <div
          className={
            nav
              ? "fixed left-0 top-0 z-10 h-screen w-full max-w-[250px] bg-bg-2 duration-300"
              : "fixed left-[-100%] top-0 z-10 h-screen w-full max-w-[250px] bg-bg-2 duration-300"
          }
        >
          <div className="mr-4 mt-4 flex items-center justify-between">
            <div className="relative ml-4  h-8 w-8 sm:flex">
              <a href={"/"}>
                {webprops && (
                  <Image src={renderNFTIcon(webprops)} alt="/logo" fill />
                )}
              </a>
            </div>

            <div
              className="right-4 top-4 cursor-pointer text-xl"
              onClick={handleNav}
            >
              X
            </div>
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col p-4 text-gray-800 ">
              {navprops &&
                navprops
                  ?.filter(
                    (nav: any) =>
                      nav.link !== "/nft-detail" &&
                      (nav.page_name === "Home" ||
                        nav.page_name === "Contact" ||
                        nav.page_name === "Blogs" ||
                        nav.page_content !== "")
                  )
                  .map((list: any, i: number) => (
                    <a
                      href={`${list.link}/index.html`}
                      key={i}
                      onClick={handleNav}
                    >
                      <li className="flex items-center py-4 text-xl hover:border-b-2">
                        {list.page_name}
                      </li>
                    </a>
                  ))}
            </ul>
          </nav>
        </div>

        <div className="relative ml-2 hidden h-8 w-8 sm:flex">
          <a href={"/"}>
            {webprops && (
              <Image src={renderNFTIcon(webprops)} alt="/logo" fill />
            )}
          </a>
        </div>

        <ul className="hidden items-center justify-between text-sm sm:flex">
          {navprops &&
            navprops
              ?.filter(
                (nav: any) =>
                  nav.link !== "/nft-detail" &&
                  (nav.page_name === "Home" ||
                    nav.page_name === "Contact" ||
                    nav.page_name === "Blogs" ||
                    nav.page_content !== "")
              )
              .map((list: any, i: number) => (
                <a
                  href={`${
                    list.link === "/"
                      ? list.link
                      : list.link +
                        (process.env.NEXT_PUBLIC_ENV !== "DEV" ? ".html" : "")
                  }`}
                  key={i}
                >
                  <li className="mx-4 hover:border-b-2">{list.page_name}</li>
                </a>
              ))}
        </ul>

        <div className="mr-2">
          {/* Connect Wallet */}
          {account != "" ? (
            <div
              onClick={openUserDrawer}
              className="photo-wrapper cursor-pointer  h-8 w-8 rounded-full  bg-gradient-to-r from-green-500 via-orange-500 to-yellow-500"
            ></div>
          ) : (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-bg-3 p-1.5 font-storeFont text-sm text-white hover:bg-bg-3/75 sm:px-3"
              onClick={() => connectMetamask()}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <WalletDrawer isOpen={isOpen} onClose={onClose} userInfo={userInfo} />
      {showPop && <NewUser open={showPop} setOpen={setShowPop} />}
    </>
  );
};

function WalletDrawer({ isOpen, onClose, userInfo }: any) {
  console.log({ userInfo });
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setUserProcess(null));
    dispatch(
      web3Init({
        web3: null,
        account: "",
        chainId: "",
      })
    );
    localStorage.removeItem("store_customer");
    onClose();
  };

  return (
    <>
      {userInfo?.wallet_address !== "" && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className="!bg-bg-2">
            <DrawerCloseButton />
            <DrawerHeader>
              <div className="flex w-fit items-center justify-between  gap-2">
                <div className="photo-wrapper   h-12 w-12 rounded-full  bg-gradient-to-r from-green-500 via-orange-500 to-yellow-500"></div>
                <div className="text-sm">
                  <p>{userInfo?.full_name}</p>
                  <p className="text-xs">
                    {customTruncateHandler(userInfo?.wallet_address, 20)}
                  </p>
                </div>
              </div>
            </DrawerHeader>

            <DrawerBody mx={0} px={2} w="full ">
              <div className="">
                <div className="rounded-xl border border-gray-300 p-3 ">
                  <div className="flex justify-between ">
                    <div className="flex w-full items-center ">
                      <div className="relative h-12 w-12">
                        <Image src={MetaFox} alt="/" fill />
                      </div>

                      <div className="text-sm">
                        <p>
                          {userInfo?.chainId === "0x13881"
                            ? "Polygon - Matic"
                            : "Different Network"}
                        </p>
                        <p className="text-xs">
                          {customTruncateHandler(userInfo?.wallet_address, 16)}
                        </p>
                      </div>
                    </div>

                    {/* power-off logo */}
                    <div
                      className="my-2 ml-4 flex cursor-pointer items-center rounded-lg bg-gray-300 hover:bg-gray-300 "
                      onClick={logout}
                    >
                      <i className="fas fa-power-off h-7 w-7 py-1.5  text-center "></i>
                    </div>
                  </div>

                  <div className="mx-0.5 my-6 rounded-xl border border-gray-200 p-3">
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="relative mr-2 h-6 w-6">
                          <Image src={MaticLogo} alt="/" fill />
                        </div>
                        <p>{userInfo?.accountBalance} <span className="text-xs">MATIC</span></p>
                      </div>
                      <p>${userInfo?.maticUSD}</p>
                    </div>

                    <div className="py-2"></div>

                    <div className="flex justify-between ">
                      <div className="flex">
                        <div className="relative mr-2 h-6 w-6">
                          <Image src={WmaticLogo} alt="/" fill />
                        </div>
                        <p>{userInfo?.wmaticBalance} <span className="text-xs">wMATIC</span></p>
                      </div>
                      <p>${userInfo?.wmaticUSD}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerBody>


          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default Navbar;
