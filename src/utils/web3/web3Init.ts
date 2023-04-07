import Web3 from 'web3';

export async function initWeb3() {
  try {
    if (!window?.ethereum) {
      throw 'Please install MetaMask';
    } else {
      let web3;

      const accounts = await window?.ethereum.request({
        method: 'eth_requestAccounts',
      });
      web3 = new Web3(window.ethereum);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      console.log('Chain Id = ', chainId);
      const maticChainId = '0x13881';

      if (chainId != maticChainId) {
        try {
          await window?.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: maticChainId }],
          });
        } catch (switchError:any  ) {
          if (switchError.code === 4902) {
            // console.log(switchError)
            console.log(
              'This network is not available in your metamask, please add it',
            );
            throw 'This network is not available in your metamask, please add it';
          }
          throw switchError?.message;
        }
      }
      const account = accounts[0];
      console.log('Account : ', account);

      // return { web3, account,chainId };
      return { success: true, web3: web3, account: account, chainId: chainId };
    }
  } catch (err) {
    console.log('ERR : ', err);
    return { success: false, message: err };
  }
}
