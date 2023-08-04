import Web3 from "web3";

export async function initWeb3() {
  try {
    if (!window?.ethereum) {
      throw "Please install MetaMask";
    } else {
      let web3;

      const accounts = await window?.ethereum.request({
        method: "eth_requestAccounts",
      });
      web3 = new Web3(window.ethereum);

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const maticChainId = "0x13881";

      if (chainId != maticChainId) {
        try {
          await window?.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: maticChainId }],
          });
        } catch (switchError: any) {
          // console.log({ switchError });
          const params = [
            {
              chainId: "0x13881",
              chainName: "Mumbai",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ];
          await window?.ethereum
            ?.request({ method: "wallet_addEthereumChain", params })
            ?.then(() => console.log("Success"))
            ?.catch((error: any) => {
              console.log("Error", error?.message);
              throw error?.message;
            });
          // if (switchError.code === 4902) {
          //   // console.log(switchError)

          //   throw "This network is not available in your metamask, please add it";
          // }
          // throw switchError?.message;
        }
      }
      const account = accounts[0];

      // return { web3, account,chainId };
      return {
        success: true,
        web3: web3,
        account: account,
        chainId: maticChainId,
      };
    }
  } catch (err) {
    console.log("ERR : ", err);
    return { success: false, message: err };
  }
}
