import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import { renderNFTImage, customTruncateHandler } from "~/utils/helper";

const NFTDetail = () => {
  const router = useRouter();

  const { id } = router.query;
  console.log(id, typeof id, "idid");
  const { data: NFTDetail } = api.storeNFT.getNFTDetail.useQuery(
    { id: id },
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(NFTDetail, "NFTDetail");

  return (
    <>
      {NFTDetail && (
        <div className="max-h-full min-h-screen w-full  bg-pm-11 px-8 pt-12 ">
          <div className="relative mx-auto flex w-full   max-w-6xl items-center justify-between">
            <div className=" h-full max-h-[500]  w-full max-w-[450px] ">
              <Image
                src={renderNFTImage(NFTDetail)}
                alt="/nft"
                width={500}
                height={500}
                className="h-full max-h-[500px] w-full  max-w-[450px] rounded-xl object-cover"
              />
            </div>

            <div className="">
              
              <p>{NFTDetail.name}</p>
              <p>{NFTDetail.description}</p>
              
              <div>
                <p>NFT Detail</p>
                <div className="grid grid-cols-2 justify-between">
                  <p>Contract Address</p>
                  <p>{customTruncateHandler(NFTDetail.contract_address)}</p>
                  <p>Token Standard</p>
                  <p>ERC-20</p>
                  <p>Token ID</p>
                  <p>{NFTDetail.token_id}</p>
                  <p>Blockchain</p>
                  <p>Ethereum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTDetail;
