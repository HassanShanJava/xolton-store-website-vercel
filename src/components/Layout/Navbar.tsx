import Image from "next/image";
import React, { useEffect, useState } from "react";

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
import { useToast } from "@chakra-ui/react";
import { setAccount } from "~/store/slices/web3Slice";

import { storeWebPageData } from "~/store/slices/pageSlice";
import { storeWebThemeData } from "~/store/slices/themeSlice";
import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";
import NewUser from "../Ui/NewUser";
import { setUserProcess } from "~/store/slices/authSlice";
import { setMaticToUsdProcess } from "~/store/slices/maticSlice";

const Navbar = ({ navData: navprops, webData: webprops }: any) => {

  const [nav, setNav] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const handleNav = () => setNav(!nav);
  const dispatch = useDispatch();
  const { addToast } = CustomToast();
  useEffect(() => {
    const localStore = JSON.parse(
      localStorage.getItem("store_customer") as string
    );
    if (localStore) {
      dispatch(setUserProcess(localStore));
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const nftPrice: number = 1;

        const maitccprice = await maticToUSD(nftPrice);
        dispatch(setMaticToUsdProcess(maitccprice));
      } catch (e) {
        console.log(e, "consvertion error front-end");
      }
    })();
  }, []);

  const { account } = useSelector((state: RootState) => state.web3);
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

      if (response?.storeCustomer === null) {
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
          addToast({
            id: "acc-changed",
            type: "success",
            message: "Account Changed!",
          });
          console.log(changed_response.store_customer);
          localStorage.setItem(
            "store_customer",
            JSON.stringify(changed_response.storeCustomer)
          );
        }
      }
    });

    window?.ethereum?.on("chainChanged", function (chainId: String) {
      if (chainId != "0x13881") {
        dispatch(setAccount(""));
      }
    });
  }

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
              <Link href={"/"}>
                {webprops && (
                  <Image src={renderNFTIcon(webprops)} alt="/logo" fill />
                )}
              </Link>
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
                    list.link === "/" ? list.link : list.link + ".html"
                  }`}
                  key={i}
                >
                  <li className="mx-4 hover:border-b-2">{list.page_name}</li>
                </a>
              ))}
        </ul>

        <div className="mr-2">
          {account != "" ? (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-bg-3 p-1.5 font-storeFont text-sm text-white hover:bg-bg-3/75 sm:px-3"
            >
              {customTruncateHandler(account, 8)}
              {/* Connect Wallet */}
            </button>
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
      {showPop && <NewUser open={showPop} setOpen={setShowPop} />}
    </>
  );
};

export default Navbar;
