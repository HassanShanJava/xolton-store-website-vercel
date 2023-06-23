import marketplaceAddress from "./../contractData/NFTMarket-address.json";
import Web3 from "web3";
import { generateOTP } from "../../helper";

async function generateUniqueRandomNumbers(
  num: number,
  min: number,
  max: number
) {
  if (num > max - min + 1 || max < min) {
    return null;
  }

  const uniqueNums: number[] = [];

  while (uniqueNums.length < num) {
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!uniqueNums.includes(randNum)) {
      uniqueNums.push(randNum);
    }
  }

  return uniqueNums[Math.floor(Math.random() * uniqueNums.length)];
}

export const signSignature = async (payload: any, web3: any) => {
  try {
    console.log({payload})
    const toWei = (num: any) => Web3.utils.toWei(num.toString(), "ether");
    const min = 2;
    const max = +generateOTP(5);
    const nonce = await web3.eth.getTransactionCount(payload?.signer);
    const random_nonce: any = await generateUniqueRandomNumbers(
      nonce,
      min,
      max
    );
    const msgParams = JSON.stringify({
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "verifyingContract", type: "address" },
        ],
        OfferNFT: [
          { name: "IsOrderAsk", type: "bool" },
          { name: "sender", type: "address" },
          { name: "collection", type: "address" },
          { name: "baseAccount", type: "address" },
          { name: "nftOwner", type: "address" },
          { name: "price", type: "uint" },
          { name: "nonce", type: "uint" },
          { name: "tokenId", type: "uint" },
        ],
      },
      //make sure to replace verifyingContract with address of deployed contract
      primaryType: "OfferNFT",
      domain: {
        name: "MarketPlace",
        version: "1",
        verifyingContract: marketplaceAddress.address,
      },
      message: {
        IsOrderAsk: false,
        sender: payload?.signer,
        collection: payload.nftContract,
        baseAccount: payload.baseAccount,
        nftOwner: payload?.nftOwner,
        price: toWei(payload?.sign_price).toString(),
        nonce: parseInt(random_nonce),
        tokenId: parseInt(payload.tokenId),
      },
    });
    const from = payload.signer;
    const params = [from, msgParams];
    const method = "eth_signTypedData_v3";

    const sign: any = await window?.ethereum.request({ method, params, from });
    return { sign, nonce: random_nonce,success: true };
  } catch (e: any) {
    return { success: false, msg: e?.message as string };
  }
};
