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
import { api } from "~/utils/api";
import { storeWebPageData } from "~/store/slices/pageSlice";
import { storeWebThemeData } from "~/store/slices/themeSlice";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => setNav(!nav);
  const dispatch = useDispatch();
  const toast = useToast();

  const { account } = useSelector((state: RootState) => state.web3);

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
      if (account !== "") {
        console.log("account :: ", accounts[0]);
        dispatch(setAccount(accounts[0]));
      }
    });

    window?.ethereum?.on("chainChanged", function (chainId: String) {
      console.log("chainChanged", chainId);
      if (chainId != "0x13881") {
        dispatch(setAccount(""));
      }
    });
  }

  const { data: details } = api.storeWeb.getStoreDetails.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: NFTStoreNavbar, isFetched } =
    api.storeWeb.getStoreNavbar.useQuery(
      {},
      {
        refetchOnWindowFocus: false,
      }
    );
  console.log(NFTStoreNavbar, "NFTStoreNavbar");
  const { data: themes, isFetched: fetchesTheme } =
    api.storeWeb.getStoreTheme.useQuery(
      {},
      {
        refetchOnWindowFocus: false,
      }
    );

  console.log(themes, "themes");

  useEffect(() => {
    if (isFetched) {
      dispatch(storeWebPageData(NFTStoreNavbar));
      dispatch(storeWebThemeData(themes));
    }
  }, [NFTStoreNavbar, themes, isFetched, fetchesTheme]);

  console.log(NFTStoreNavbar, "NFTStoreNavbar");

  const navData =
    isFetched &&
    NFTStoreNavbar?.filter((nav: any) => nav.link != "/nft-detail");

  console.log(navData, "navData");
  // window?.ethereum?.on("networkChanged", handleNetworkChange);
  return (
    <>
      <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white p-2 shadow-md">
        {/* for mobile menu state */}
        <div className=" sm:hidden" onClick={handleNav}>
          {nav ? (
            ""
          ) : (
            <div className="relative ml-4 flex h-8 w-8">
              <Image src={MenuIcon} alt="/logo" fill priority />
            </div>
          )}
        </div>

        <div
          className={
            nav
              ? "fixed left-0 top-0 z-10 h-screen w-full max-w-[300px] bg-white duration-300"
              : "fixed left-[-100%] top-0 z-10 h-screen w-full max-w-[300px] bg-white duration-300"
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
              {navData &&
                navData.map((list: any, i: number) => (
                  <Link href={list.link} key={i}>
                    <li className="flex items-center py-4 text-xl">
                      {list.page_name}
                    </li>
                  </Link>
                ))}
            </ul>
          </nav>
        </div>

        <div className="relative ml-4 hidden h-8 w-8 sm:flex">
          <Link href={"/"}>
            {details&&<Image src={renderNFTIcon(details)} alt="/logo" fill />}
          </Link>
        </div>

        <ul className="hidden items-center justify-between text-sm sm:flex">
          {navData &&
            navData.map((list: any, i: number) => (
              <Link href={list.link} key={i}>
                <li className="mx-4">{list.page_name}</li>
              </Link>
            ))}
        </ul>

        <div className="mr-4">
          {account != "" ? (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-accentLinear-1 p-1.5 font-storeFont text-sm text-white hover:bg-ac-2"
            >
              {customTruncateHandler(account, 8)}
            </button>
          ) : (
            <button
              type="button"
              className=" sm:text-md rounded-3xl bg-accentLinear-1 p-1.5 font-storeFont text-sm text-white hover:bg-ac-2 sm:px-3"
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

// // This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
  

//   // Pass data to the page via props
//   return { props: { details } };
// }

export default Navbar;
