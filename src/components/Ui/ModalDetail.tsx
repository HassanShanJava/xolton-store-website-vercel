import Image from "next/image";
import { forwardRef, useEffect } from "react";
import React, { useId, useState } from "react";
import UploadImage from "~/public/images/image.svg";
import { customTruncateHandler, renderNFTImage } from "~/utils/helper";
export function DetailSection(props: any) {
  return (
    <div className="flex items-center justify-start gap-3 rounded-xl border border-gray-700 p-2">
      <div className="relative h-20 w-20">
        <Image
          src={renderNFTImage(props?.nft)}
          alt="/"
          fill
          priority
          quality={100}
          className="mx-auto rounded-xl object-cover object-right "
        />
      </div>
      <div>
        <p className="font-bold">NFT Info</p>
        <p>{props?.nft.name}</p>
        <p className="text-xs">
          {customTruncateHandler(props?.nft.creator_id, 20)}
        </p>
      </div>
    </div>
  );
}
