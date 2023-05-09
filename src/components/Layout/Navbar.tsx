import Image from "next/image";
import React, { useEffect, useState } from "react";

import Logo from "../../public/images/logo.png";
import MenuIcon from "../../public/icons/hamburger.svg";
import Link from "next/link";
import { customTruncateHandler, renderNFTIcon } from "~/utils/helper";
import { web3Init } from "~/store/slices/web3Slice";
import { initWeb3 } from "~/utils/web3/web3Init";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";
import { setAccount } from "~/store/slices/web3Slice";

import { storeWebPageData } from "~/store/slices/pageSlice";
import { storeWebThemeData } from "~/store/slices/themeSlice";

import { useQuery } from "@tanstack/react-query";

const Navbar = ({ navData: navprops, webData: webprops }: any) => {
  const [nav, setNav] = useState(false);
  const handleNav = () => setNav(!nav);
  const dispatch = useDispatch();
  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);

  // connect wallet
  const connectMetamask = async () => {
    let data: any = await initWeb3();
    console.log("Data : ", data);
    if (data?.success !== false) {
      console.log("check");
      toast({
        title: "Wallet connected",
        status: "success",

        isClosable: true,
        position: "top-left",
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
        ? toast({
            title: data.message.message,
            status: "error",
            isClosable: true,
            position: "top-left",
          })
        : toast({
            title: data.message,
            status: "error",
            isClosable: true,
            position: "top-left",
          });
    }
  };

  if (typeof window !== "undefined") {
    window?.ethereum?.on("accountsChanged", function (accounts: String) {
      if (account !== "") {
        console.log("account :: ", accounts[0]);
        dispatch(setAccount(accounts[0]));
      }

      // else{
      // if no extension found?
      // toast({
      //   title: "Please Install Metamask",
      //   status: "error",
      //   isClosable: true,
      //   position: "top-left",
      // });
      // }
    });

    window?.ethereum?.on("chainChanged", function (chainId: String) {
      console.log("chainChanged", chainId);
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
                  ?.filter((list: any) => list.page_name !== "NFT Detail")
                  .map((list: any, i: number) => (
                    <a
                      href={`${list.link}/index.html`}
                      key={i}
                      onClick={handleNav}
                    >
                      <li className="flex items-center py-4 text-xl hover:text-white">
                        {list.page_name}
                      </li>
                    </a>
                  ))}
            </ul>
          </nav>
        </div>

        <div className="relative ml-2 hidden h-8 w-8 sm:flex">
          <Link href={"/"}>
            {webprops && (
              <Image src={renderNFTIcon(webprops)} alt="/logo" fill />
            )}
          </Link>
        </div>

        <ul className="hidden items-center justify-between text-sm sm:flex">
          {navprops &&
            navprops
              ?.filter((list: any) => list.page_name !== "NFT Detail")
              .map((list: any, i: number) => (
                <a
                  href={`${
                    list.link === "/" ? list.link : list.link + "/index.html"
                  }`}
                  key={i}
                >
                  <li className="mx-4 hover:text-white">{list.page_name}</li>
                </a>
              ))}
        </ul>

        <div className="mr-2">
          {account != "" ? (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-bg-3 p-1.5 font-storeFont text-sm text-white hover:bg-bg-3/75"
            >
              {customTruncateHandler(account, 8)}
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
    </>
  );
};

export default Navbar;
