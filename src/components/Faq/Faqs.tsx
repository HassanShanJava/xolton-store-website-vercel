import React, { useEffect } from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useRouter } from "next/router";

const AboutUs = ({ navData, webData }: any) => {
  let storeBlogsData: any;
  const faqPage = navData.filter((page: any) => page.page_name === "FAQs");

  if (faqPage[0]?.page_content !== "" && faqPage[0]?.visibility) {
    storeBlogsData = {
      data: faqPage[0]?.page_content,
    };
  }

  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 py-4">
        <CraftJsComponent storeBlogsData={storeBlogsData} />
      </div>
    </>
  );
};

export default AboutUs;
