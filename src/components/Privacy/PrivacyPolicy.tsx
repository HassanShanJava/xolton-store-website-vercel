import React from "react";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { useRouter } from "next/router";

const PrivacyPolicy = ({ storePrivacyData }: any) => {
  const router = useRouter();
  const { asPath } = useRouter();
  let storeBlogsData: any;
  if (storePrivacyData?.page_content !== "" && storePrivacyData?.visibility) {
    storeBlogsData = {
      data: storePrivacyData?.page_content,
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

export default PrivacyPolicy;