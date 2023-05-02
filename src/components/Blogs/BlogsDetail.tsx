import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { customTruncateHandler } from "~/store/helper";

import { displayDate, renderNFTImage } from "~/utils/helper";
import CraftJsComponent from "../craftComponent/CraftJsComponent";
import { prisma } from "~/server/db";

const BlogsListing = ({ storeBlogsData }: any) => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:::", id);

  console.log("storeBlogsData:::", storeBlogsData);

  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 py-4">
        <CraftJsComponent storeBlogsData={storeBlogsData} />
      </div>
    </>
  );
};

export default BlogsListing;
