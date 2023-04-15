import Image from "next/image";
import React, { useEffect, useState } from "react";

import Logo from "../../public/images/logo.png";
import MenuIcon from "../../public/icons/hamburger.svg";
import Link from "next/link";
import { customTruncateHandler } from "~/utils/helper";
import { web3Init } from "~/store/slices/web3Slice";
import { initWeb3 } from "~/utils/web3/web3Init";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useToast } from "@chakra-ui/react";
import { setAccount } from "~/store/slices/web3Slice";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => setNav(!nav);
  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);
  const dispatch = useDispatch();

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
      data &&
        toast({
          title: data.message.message,
          status: "error",
          isClosable: true,
          position: "top-left",
        });
    }
  };

  if (typeof window !== "undefined") {
    window?.ethereum?.on("accountsChanged", function (accounts: String) {
      console.log("account :: ", accounts[0]);
      dispatch(setAccount(accounts[0]));
    });

    window?.ethereum.on("chainChanged", function (chainId: String) {
      console.log("chainChanged", chainId);
      if (chainId != "0x13881") {
        dispatch(setAccount(""));
      }
    });
  }

  // window?.ethereum?.on("networkChanged", handleNetworkChange);
  return (
    <>
      <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white p-4 shadow-md">
        {/* for mobile menu state */}
        <div className=" sm:hidden" onClick={handleNav}>
          {nav ? (
            ""
          ) : (
            <div className="relative ml-4 flex h-10 w-10">
              <Image src={MenuIcon} alt="/logo" fill />
            </div>
          )}
        </div>

        <div
          className={
            nav
              ? "fixed left-0 top-0 z-10 h-screen w-[300px] bg-white duration-300"
              : "fixed left-[-100%] top-0 z-10 h-screen w-[300px] bg-white duration-300"
          }
        >
          <div
            className="absolute right-4 top-4 cursor-pointer text-xl"
            onClick={handleNav}
          >
            X
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col p-4 text-gray-800 ">
              <Link href="/">
                <li className="flex items-center py-4 text-xl">Home</li>
              </Link>
              <Link href="/blogs">
                <li className="flex items-center py-4 text-xl">Blog</li>
              </Link>
              <Link href="/about-us">
                <li className="flex items-center py-4 text-xl">About Us</li>
              </Link>
              <Link href="/faqs">
                <li className="flex items-center py-4 text-xl">FAQ</li>
              </Link>
            </ul>
          </nav>
        </div>

        <div className="relative ml-4 hidden h-10 w-10 sm:flex">
          <Link href={"/"}>
            <Image src={Logo} alt="/logo" fill />
          </Link>
        </div>

        <ul className="hidden items-center justify-between sm:flex ">
          <Link href="/">
            <li className="mx-4">Home</li>
          </Link>
          <Link href="/blogs">
            <li className="mx-4">Blog</li>
          </Link>
          <Link href="/about-us">
            <li className="mx-4">About Us</li>
          </Link>
          <Link href="/faqs">
            <li className="mx-4">FAQ</li>
          </Link>
        </ul>

        <div className="mr-4">
          {account != "" ? (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-accentLinear-1 p-2 font-storeFont text-sm text-white hover:bg-ac-2"
              onClick={() => connectMetamask()}
            >
              {customTruncateHandler(account, 8)}
            </button>
          ) : (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-accentLinear-1 p-2 font-storeFont text-sm text-white hover:bg-ac-2 sm:px-3"
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
