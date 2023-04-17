import dynamic from "next/dynamic";
const NFTDetails = dynamic(() => import("../../components/NFT/NFTDetail"), {
  ssr: true,
});

export default function detailPage() {
  return (
    <>
      <NFTDetails />
    </>
  );
}
