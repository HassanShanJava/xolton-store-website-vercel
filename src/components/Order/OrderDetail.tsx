import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { customTruncateHandler, renderBanner } from "~/utils/helper";
import BannerImage from "~/public/images/banner.png";

import { displayDate, renderNFTImage } from "~/utils/helper";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import UserOrderListing from "./UserOrderListing";
import OrderTable from "./UserOrderListing";
import OfferTable from "./UserOfferListing";

const OrderDetail = ({ storeBlogsData }: any) => {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div className="w-full ">
      <div className="max-h-full min-h-screen  bg-bg-1 px-4 py-4">
        <div className="mt-10">
          {/* <ProfileInformation user={user} /> */}

          <Tabs isLazy>
            <div className="mx-auto max-w-[90%]">
              <TabList>
                <Tab>Orders</Tab>
                <Tab>Bids Made</Tab>
                <Tab>Bids received</Tab>
              </TabList>
            </div>

            <TabPanels>
              <TabPanel>
                <OrderTable />
              </TabPanel>
              <TabPanel>
                <OfferTable bid_type="made" />
              </TabPanel>
              <TabPanel>
                <OfferTable bid_type="received" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
