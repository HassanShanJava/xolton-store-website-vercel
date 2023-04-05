import React from "react";
import NFTCard from "../Ui/NFTCard";

// images
import Character1 from "../../public/images/character-1.png";
import Character2 from "../../public/images/character-2.png";
import Character3 from "../../public/images/character-3.png";
import Character4 from "../../public/images/character-4.png";
import Character5 from "../../public/images/character-5.png";
import Character6 from "../../public/images/character-6.png";
import Character7 from "../../public/images/character-7.png";
import Character8 from "../../public/images/character-8.png";
const nfts = [
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character1,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character2,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character3,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character4,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character5,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character6,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character7,
  },
  {
    nft_name: "Stone Head",
    eth: "0.0002 Eth",
    img_path: Character8,
  },
];

const NFTListing = () => {
  return (
    <>
    <div className="grid grid-cols-1 sx:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full ">
      {nfts.map((nft, i) => (
        <NFTCard nft={nft} />
      ))}
    </div>
    </>
  );
};

export default NFTListing;
