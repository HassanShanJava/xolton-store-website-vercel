import React, { useEffect } from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useRouter } from "next/router";

const PrivacyPolicy = ({ navData, webData }: any) => {
  const router = useRouter();
  const { asPath } = useRouter();
  let storeBlogsData: any;
  const privacyPage = navData.filter(
    (page: any) => page.page_name === "Privacy"
  );
  if (privacyPage[0]?.page_content !== "" && privacyPage[0]?.visibility) {
    storeBlogsData = {
      data: privacyPage[0]?.page_content,
    };
  }
  useEffect(() => {
    if (privacyPage[0]?.page_content !== "" && privacyPage[0]?.visibility) {
      storeBlogsData = {
        data: privacyPage[0]?.page_content,
      };
    } else {
      router.push("/");
    }
  }, []);

  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 py-4">
        <CraftJsComponent storeBlogsData={storeBlogsData} />
      </div>
    </>
  );
};

export default PrivacyPolicy;
