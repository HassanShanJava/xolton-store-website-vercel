// Mint NFt
import NftAbi from "./contractData/NFT.json";
import NftMarketAddress from "./contractData/NFTMarket-address.json";

export async function approveContract(
  web3: any,
  account: string | undefined,
  nftAddress: string | undefined
) {
  // make contract Instance
  const contract = new web3.eth.Contract(
    NftAbi.abi, //ABI
    nftAddress
  ); //Contract Address

  try {
    const approve = await contract.methods
      .isApprovedForAll(account, NftMarketAddress.address)
      .call();

    if (!approve) {
      await contract.methods
        .setApprovalForAll(NftMarketAddress.address, true)
        .send({ from: account });
    }
    return { success: true };
  } catch (error: any) {
    console.log("error::", error);
    return { success: false, msg: error?.message as string };
  }
}
