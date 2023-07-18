// Mint NFt

import MarketPlaceAbi from "./contractData/NFTMarket.json";
import MarketPlaceAddress from "./contractData/NFTMarket-address.json";
import Web3 from "web3";
const toWei: any = (num: any) => Web3.utils.toWei(num.toString(), "ether");

export async function offerAccept(web3: any, account: string, makerOrder: any) {
  const makeArr: any = [];
  const takeArr: any = [];
  // make contract Instance
  const marketPlacecContract = new web3.eth.Contract(
    MarketPlaceAbi.abi, //ABI
    MarketPlaceAddress.address
  ); //Contract Address

  try {
    console.log("Maker Order :: ", makerOrder);
    makeArr.push(
      // makerOrder?.isOrderAsk,
      false,
      makerOrder?.signer,
      makerOrder?.baseAccount,
      makerOrder?.nftContract,
      account,
      toWei(makerOrder?.price).toString(),
      makerOrder?.tokenId,
      toWei(makerOrder?.tax).toString(),
      toWei(makerOrder?.royalty)?.toString(),
      makerOrder?.nonce,
      makerOrder?.signed_v,
      makerOrder?.signed_r,
      makerOrder?.signed_s
    );
    console.log("Maker Order :: ", makeArr);
    takeArr.push(
      true,
      account,
      toWei(makerOrder?.price).toString(),
      makerOrder?.tokenId
    );
    console.log("Taker Order :: ", takeArr);

    let transaction_id: any;
    const result = await marketPlacecContract.methods
      .matchBidWithTakerAsk(takeArr, makeArr)
      .send({ from: account })
      .on("transactionHash", async (hash: string) => {
        transaction_id = hash;
        console.log("Hash... ", transaction_id);
      });
    return {
      success: true,
      transaction_id: transaction_id,
      previous_owner_address: account,
      owner_address: makerOrder?.signer,
      // sell_type: 'offer',
    };
    // return { success: true, transaction_id: "123",previous_owner:"2124",owner:"121131213" };
  } catch (error: any) {
    console.log("ERROR :: ", error);
    console.log("error::", error);
    return { success: false, message: error?.message as string };
  }
}
