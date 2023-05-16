import React, { useEffect } from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useRouter } from "next/router";

const AboutUs = ({ navData, webData }: any) => {
  const router = useRouter();
  const { asPath } = useRouter();

  const aboutPage = navData.filter((page: any) => page.page_name === "About");
  let storeBlogsData: any;
  if (aboutPage[0]?.page_content !== "" && aboutPage[0]?.visibility) {
    storeBlogsData = {
      data: aboutPage[0]?.page_content,
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
