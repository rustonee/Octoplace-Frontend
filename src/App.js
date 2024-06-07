/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Listings } from "./pages/listings/Listings";
import { MyNFT } from "./pages/dashboard/MyNFT";
import { ListingOffers } from "./pages/ListingOffers";
import { SwapComplete } from "./pages/SwapComplete";
import { MyListingSwapOffer } from "./pages/swap-offer/MyListingSwapOffer";
import { SingleSwapOffer } from "./pages/SingleSwapOffer";
import { MyListingSwapOffer2 } from "./pages/MyListingSwapOffer2";
import { useWeb3React } from "@web3-react/core";
import { GTMProvider } from "@elgorditosalsero/react-gtm-hook";
import "./app.scss";
import {
  setAddress,
  setBalance,
  setChainId,
  setLogin,
  setLogout,
} from "./redux/slices/accout-slice";
import { getFormattedEther } from "./utils/unit-utils";
import { resetCollections } from "./redux/slices/my-nft-slice";
import { NFTView } from "./pages/view-nft/NFTView";
import { setTxCharge, hideTxDialog } from "./redux/slices/app-slice";
import { createAction } from "@reduxjs/toolkit";
import { getAllTrades } from "./redux/thunk/get-trades";
import { JsonRpcProvider } from "@ethersproject/providers";
import { rpc, swapAbi, swapContract } from "./connectors/address";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import {
  activateInjectedProvider,
  injectedConnector,
} from "./connectors/injected-connector";
import { TxDialog } from "./components/dialogs/txdialog";
import { FaucetPage } from "./pages/faucet/faucet";
import { CollectionsPage } from "./pages/collections/collection";
import NFTPage from "./pages/collections/nft";

import Market from "./pages/market/Market";
import Swap from "./pages/market/Swap";
import Auction from "./pages/market/Auction";
import { getAllMarketItems } from "./redux/thunk/get-all-market-items";
import CollectionSettings from "./pages/collections/collectionSettings";
import { getAllCollections } from "./redux/thunk/getAllCollections";
import DashboardHome from "./pages/dashboard/dashboardHome";
import DashboardGuest from "./pages/dashboard/dashboardGuest";
import DashboardSettings from "./pages/dashboard/dashboardSettings";
import contractInteraction from "./contracts";

import { ThemeProvider } from "@mui/system";
import { theme } from "./theme";

const gtmParams = {
  id:
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_GTM_PRODUCT_ID
      : process.env.REACT_APP_GTM_DEVELOP_ID,
};

function App() {
  const { account, chainId, library, activate } = useWeb3React();
  const dispatch = useDispatch();
  const loggedAddress = useSelector((state) => state.account.address);
  const myNftOwner = useSelector((state) => state.myNFT.nftOwner);
  const txDialogState = useSelector((state) => state.app.txDialog);

  const getBalance = async () => {
    const bal = await library.getBalance(account);
    dispatch(setBalance(getFormattedEther(bal)));
  };

  //Update wallet connection changes
  useEffect(() => {
    if (account && account !== "") {
      dispatch(setAddress(account));
      dispatch(setChainId(chainId));
      dispatch(setLogin());
      getBalance();
    } else {
      dispatch(setLogout());
      dispatch(resetCollections());
    }
  }, [account]);

  useEffect(() => {
    if (chainId && account) {
      getBalance();
    }
  }, [chainId]);

  useEffect(() => {
    if (loggedAddress !== "" && myNftOwner !== loggedAddress) {
      //if(chainId===361){
      dispatch(createAction("LOAD_MY_NFTS_API")({ account: loggedAddress }));
      //}else {
      // dispatch(createAction("LOAD_MY_NFTS")({nftAddrList: collections, account:loggedAddress}));
      //}
    }
  }, [loggedAddress]);

  useEffect(() => {
    // console.log("Gethering prepare");
    if (typeof window === "undefined") {
      return;
    }
    // console.log("Getering started");
    contractInteraction.gatherSpots();
  }, []);

  const getTxCharge = async () => {
    const provider = new JsonRpcProvider(rpc);
    const contract = new Contract(swapContract, swapAbi, provider);
    let txCharge = await contract.getTxCharge();
    txCharge = formatUnits(txCharge, 18);
    dispatch(setTxCharge(txCharge));
  };
  useEffect(() => {
    dispatch({ type: "LOAD_ALL_LISTING" });
    dispatch({ type: "LOAD_ALL_OFFERS" });
    dispatch(getAllTrades());
    dispatch(getAllMarketItems());
    dispatch(getAllCollections());
    getTxCharge();

    try {
      activateInjectedProvider("MetaMask");
      activate(injectedConnector);
    } catch {}
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GTMProvider state={gtmParams}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/market/swap" element={<Swap />} />
              <Route path="/market/auction" element={<Auction />} />
              <Route path="my-nft" element={<MyNFT />} />
              <Route
                path="popular/nft/:network/:address/:tokenId"
                element={<NFTView />}
              />
              <Route
                path="nft/:network/:address/:tokenId"
                element={<NFTView />}
              />
              <Route path="listing" element={<Listings />} />
              <Route path="listing/offers" element={<ListingOffers />} />
              <Route
                path="swap/:network/:offerId"
                element={<SingleSwapOffer />}
              />
              <Route
                path="swap/initiate-offer/:network/:listingId/:offerNft/:offerTokenId"
                element={<MyListingSwapOffer />}
              />
              <Route path="swap/mylist2" element={<MyListingSwapOffer2 />} />
              <Route path="swap/done" element={<SwapComplete />} />
              <Route path="faucet" element={<FaucetPage />} />
              <Route path="popular/collection/:address" element={<NFTPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collection/:address" element={<NFTPage />} />
              <Route
                path="collections/settings/:network/:collectionAddress"
                element={<CollectionSettings />}
              />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="dashboard/guest" element={<DashboardGuest />} />
              <Route
                path="dashboard/settings"
                element={<DashboardSettings />}
              />
            </Routes>
            <TxDialog
              isOpen={txDialogState.isOpen}
              isPending={txDialogState.isPending}
              txHash={txDialogState.txHash}
              isSuccessful={txDialogState.isSuccess}
              isFailed={txDialogState.isFailed}
              onClose={() => {
                dispatch(hideTxDialog());
              }}
            />
          </Layout>
        </GTMProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
