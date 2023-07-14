import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  customTruncateHandler,
  renderBanner,
  renderImage,
} from "~/utils/helper";
import BannerImage from "~/public/images/banner.png";

import { displayDate, renderNFTImage } from "~/utils/helper";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import UserNFTListing from "./UserNFTListing";

const ProfileDetail = ({ storeBlogsData }: any) => {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div className="w-full ">
      <div className="max-h-full min-h-screen  bg-bg-1 px-8 py-4">
        {/* <CraftJsComponent storeBlogsData={storeBlogsData} /> */}
        <ProfileSection user={user} />
        <div className="mt-10">
          <ProfileInformation user={user} />

          <Tabs isLazy>
            <TabList>
              <Tab>Owned</Tab>
              <Tab>Listed</Tab>
              <Tab>Unlisted</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <UserNFTListing is_purchase="owned" />
              </TabPanel>
              <TabPanel>
                <UserNFTListing is_purchase="listed" />
              </TabPanel>
              <TabPanel>
                <UserNFTListing is_purchase="unlisted" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
const ProfileSection = ({ user }: any) => {
  return (
    <div className=" bg-light/30 draggable relative mb-6 flex w-full min-w-0 flex-col break-words rounded-2xl border border-dashed border-stone-200 bg-clip-border">
      <div className=" relative min-h-[280px] flex-auto bg-transparent px-9  pb-0 pt-9">
        <Image
          src={user?.cover_pic ? renderImage(user?.cover_pic) : BannerImage.src}
          alt="/banner"
          fill
          priority
          quality={100}
          className={` rounded-lg object-cover`}
        />
      </div>
      <div className="absolute -bottom-8 left-2 flex h-[120px] w-[120px] items-center  justify-center rounded-full bg-white bg-gradient-to-r text-center  text-4xl text-white shadow-md">
        <Image
          src={
            user?.profile_pic ? renderImage(user?.profile_pic) : BannerImage.src
          }
          alt="/banner"
          fill
          priority
          quality={100}
          className={`rounded-full object-contain p-2`}
        />
      </div>
    </div>
  );
};
const ProfileInformation = ({ user }: any) => {
  return (
    <div className="bg-light/30 draggable relative mb-6 flex w-full min-w-0 flex-col break-words rounded-2xl border border-dashed border-stone-200 bg-clip-border">
      <div className="min-h-[70px] flex-auto bg-transparent px-9 pb-0 pt-9">
        <div className="mb-6 flex flex-wrap xl:flex-nowrap">
          <div className="grow">
            <div className="mb-2 flex flex-wrap items-start justify-between">
              <div className="flex flex-col">
                <div className="mb-2 flex items-center">
                  <a
                    className="text-secondary-inverse hover:text-primary mr-1 text-[1.5rem] font-semibold transition-colors duration-200 ease-in-out"
                    href="javascript:void(0)"
                  >
                    {" "}
                    {user?.full_name}
                  </a>
                </div>
                <div className="mb-4 flex flex-wrap pr-2 font-medium">
                  <a
                    className="text-secondary-dark hover:text-primary mb-2 mr-5 flex items-center"
                    href="javascript:void(0)"
                  >
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </span>{" "}
                    {user?.email}
                  </a>
                </div>
                <div className="mb-4 flex flex-wrap pr-2 font-medium">
                  {user?.twitter && (
                    <a
                      className="text-lightBlue-600 align-center mr-2 flex h-10 w-10 items-center justify-center rounded-full  bg-white text-center font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                      href={`https://www.facebook.com/${user?.twitter}`}
                      target="_blank"
                    >
                      <i className="fab fa-twitter text-xl text-black"></i>
                    </a>
                  )}
                  {user?.facebook && (
                    <a
                      className="text-lightBlue-600 align-center mr-2 flex h-10 w-10 items-center justify-center rounded-full  bg-white text-center font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                      href={`https://www.facebook.com/${user?.facebook}`}
                      target="_blank"
                    >
                      <i className="fab fa-facebook-square text-xl text-black"></i>
                    </a>
                  )}
                  {user?.instagram && (
                    <a
                      className="text-lightBlue-600 align-center mr-2 flex h-10 w-10 items-center justify-center rounded-full  bg-white text-center font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                      href={`https://www.facebook.com/${user?.instagram}`}
                      target="_blank"
                    >
                      <i className="fab fa-instagram text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
              <div className="my-auto  flex-wrap space-y-2">
                <div className="flex gap-2">
                  <div className="rounded-md  text-sm">Wallet Address:</div>
                  <div className="rounded-md  text-sm">
                    {customTruncateHandler(user?.wallet_address)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    className="mb-1 mr-1 w-full cursor-pointer rounded bg-bg-3 px-6 py-3 text-center text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    href={`/user/setting${
                      process.env.NEXT_PUBLIC_ENV !== "DEV" ? ".html" : ""
                    }`}
                  >
                    Edit Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileDetail;
