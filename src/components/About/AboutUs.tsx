import React from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useRouter } from "next/router";

const AboutUs = () => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { pageData } = useSelector((state: RootState) => state.page);
  const pageContent: any = pageData?.find((item: any) => item?.link == asPath);
  let storeBlogsData: any;
  if (pageContent !== undefined && pageContent?.visibility) {
    storeBlogsData = {
      data: pageContent?.page_content,
    };
  } else {
    router.push("/");
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
