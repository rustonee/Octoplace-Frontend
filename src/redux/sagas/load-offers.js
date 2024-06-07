import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";
import { takeLeading, put, call } from "redux-saga/effects";
import { formatOffers } from "../../utils/format-listings";
import { setOffersLoading } from "../slices/app-slice";
import { setOffers } from "../slices/listing-slice";
import { NETWORKS } from "../../connectors/networks";

function* LoadAllOffersWatcher() {
  yield takeLeading("LOAD_ALL_OFFERS", LoadAllOffersWorker);
}

function* LoadAllOffersWorker(action) {
  try {
    yield put(setOffersLoading(true));
    const offers = yield call(loadAllOffers);
    yield put(setOffers(offers));
    yield put(setOffersLoading(false));
  } catch (e) {
    yield;
    yield put(createAction("LOAD_FAILED")(e));
  }
}

const loadAllOffers = async () => {
  try {

    let finalOffers = [];
    const nets = [NETWORKS.THETA, NETWORKS.KAVA];
    for(var net of nets){
      const chainId = net.CHAIN_ID;
      const provider = new JsonRpcProvider(net.RPC);
      const contract = new Contract(net.SWAP_CONTRACT, net.SWAP_ABI, provider);
      let offers = await contract.readAllOffers();
      offers = formatOffers(offers);
      for(var offer of offers){
        finalOffers = [...finalOffers, {...offer, network: (parseInt(chainId) === 361 ? "theta" : (parseInt(chainId)=== 2222 ? "kava" : "") )}]  //TODO - change hardcoded chainid to Mainnet
      }
    }
    return finalOffers;
  } catch (e) {
    console.log(e);
  }
};

export default LoadAllOffersWatcher;
