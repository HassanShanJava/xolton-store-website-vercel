// Mint NFt

import MarketPlaceAbi from './contractData/NFTMarket.json';
import MarketPlaceAddress from './contractData/NFTMarket-address.json';
import Web3 from 'web3';
const toWei:any = (num:any) => Web3.utils.toWei(num.toString(), "ether");

export async function buyNFT(
    web3: any,
    account: string,
    totalPrice:Int16Array,
    makerOrder: any
  ) {
    console.log(
      'web3, account, url, nftAddress ::: ',
      web3,
      account,
      totalPrice,
      makerOrder
    );

    const makeArr:any=[];
    const takeArr:any=[];
    // make contract Instance
    const marketPlacecContract = new web3.eth.Contract(
        MarketPlaceAbi.abi, //ABI
        MarketPlaceAddress.address,
    ); //Contract Address
    
    try{
        makeArr.push(
            makerOrder?.isOrderAsk,
            makerOrder?.signer,
            makerOrder?.baseAccount,
            makerOrder?.nftContract,
            toWei(makerOrder?.price).toString(),
            makerOrder?.tokenId,
            toWei((makerOrder?.tax)).toString(),
            makerOrder?.nonce,
            makerOrder?.signed_v,
            makerOrder?.signed_r,
            makerOrder?.signed_s
        )
        takeArr.push(
            false,
            account,
            toWei(totalPrice).toString(),
            makerOrder?.tokenId
        )

        console.log("MAKE :: ",makeArr)
        console.log("TAKE :: ",takeArr)
        
        let transaction_id;
        const result = await marketPlacecContract.methods
        .matchAskWithTakerBid(takeArr,makeArr)
        .send({ from: account, value: toWei(totalPrice) })
        .on('transactionHash', async (hash: string) => {
            transaction_id = hash
            console.log('Hash... ', transaction_id);
        });
        return { success: true, transaction_id: transaction_id,previous_owner:makerOrder?.signer,owner:account };
        // return { success: true, transaction_id: "123",previous_owner:"2124",owner:"121131213" };
    }catch(error: any){
        console.log("ERROR :: ",error)
        console.log('error::', error);
        return { success: false, msg: error?.message as string };
    }
}