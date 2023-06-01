import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { customTruncateHandler } from "~/store/helper";

import { displayDate, renderNFTImage } from "~/utils/helper";
import CraftJsComponent from "../craftComponent/CraftJsComponent";

const BlogsListing = ({ storeBlogsData }: any) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="max-w-[1600px] w-full ">
      <div className="max-h-full min-h-screen   bg-bg-1 x-8 my-4">
        <CraftJsComponent storeBlogsData={storeBlogsData} />
      </div>
    </div>
  );
};

export default BlogsListing;
