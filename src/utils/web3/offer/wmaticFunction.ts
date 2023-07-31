import WMATICAbi from "../contractData/WMATIC.json";
import WMATICAddress from "../contractData/WMATIC-address.json";
import MarketPlaceAddress from "../contractData/NFTMarket-address.json";
import Web3 from "web3";
const toWei: any = (num: any) => Web3.utils.toWei(num.toString(), "ether");

export async function maticDeposit(
  web3: any,
  account: string,
  conversionPrice: any
) {
  const WMATICContract = new web3.eth.Contract(
    WMATICAbi, //ABI
    WMATICAddress.address
  ); //Contract Address
  let transaction_id;
  try {
    const price = +conversionPrice?.toFixed(5);
    console.log("convert :: ", price);
    const result = await WMATICContract.methods
      .deposit()
      .send({ from: account, value: toWei(price) })
      .on("transactionHash", async (hash: string) => {
        transaction_id = hash;
        console.log("Hash... ", transaction_id);
      });

    return {
      success: true,
    };
  } catch (error: any) {
    console.log("Error : ", error);
    return { success: false, msg: error?.message as string };
  }
}

export async function approvalWMATIC(
  web3: any,
  account: string,
  totalPrice: any
) {
  const WMATICContract = new web3.eth.Contract(
    WMATICAbi, //ABI
    WMATICAddress.address
  ); //Contract Address
  let transaction_id;
  try {
    const price = +totalPrice?.toFixed(5);

    const result = await WMATICContract.methods
      .approve(MarketPlaceAddress.address, toWei(price))
      .send({ from: account })
      .on("transactionHash", async (hash: string) => {
        transaction_id = hash;
        console.log("Hash... ", transaction_id);
      });

    return {
      success: true,
    };
  } catch (error: any) {
    console.log("Error : ", error);
    return { success: false, msg: error?.message as string };
  }
}

export async function getBalance(web3: any, account: any) {
  const WMATICContract = new web3.eth.Contract(
    WMATICAbi, //ABI
    WMATICAddress.address
  ); //Contract Address

  try {
    const balance = await WMATICContract.methods.balanceOf(account).call();

    return {
      success: true,
      amount: balance,
    };
  } catch (error: any) {
    console.log("Error : ", error);
    return { success: false, msg: error?.message as string };
  }
}
