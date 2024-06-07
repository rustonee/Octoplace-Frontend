import { InjectedConnector } from "@web3-react/injected-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
   361, 2222
  ], 
});

export function activateInjectedProvider(providerName) {
  const { ethereum } = window;

  if (!ethereum?.providers) {
      return undefined;
  }

  let provider;
  switch (providerName) {
      case 'CoinBase':
          provider = ethereum.providers.find(({ isCoinbaseWallet}) => isCoinbaseWallet);
          break;
      case 'MetaMask':
          provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
          break;
      default:
        break;
  }

  if (provider) {
      ethereum.setSelectedProvider(provider);
  }
}