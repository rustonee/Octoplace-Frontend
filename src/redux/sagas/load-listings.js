import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";
import { takeLeading, put, call } from "redux-saga/effects";
import { formatListings } from "../../utils/format-listings";
import { setLoading } from "../slices/app-slice";
import { NETWORKS } from "../../connectors/networks";

function* LoadAllListingsWatcher() {
  yield takeLeading("LOAD_ALL_LISTING", LoadAllListingsWorker);
}

function* LoadAllListingsWorker(action) {
  try {
    yield put(setLoading(true));
    const listings = yield call(loadAllListings);
    for (const item of listings) {
      yield put(createAction("LOAD_LISTING_NFT")(item));
    }
  } catch (e) {
    yield;
    yield put(createAction("LOAD_FAILED")(e));
  }
}

const loadAllListings = async () => {
  try {
    let finalListings = [];
    const nets = [NETWORKS.THETA, NETWORKS.KAVA];
    for (var net of nets) {
      const chainId = net.CHAIN_ID;
      const provider = new JsonRpcProvider(net.RPC);
      const contract = new Contract(net.SWAP_CONTRACT, net.SWAP_ABI, provider);
      let listings = await contract.readAllListings();
      listings = formatListings(listings);
      for (var listing of listings) {
        finalListings = [...finalListings, {...listing, network: (parseInt(chainId) === 361 ? "theta" : (parseInt(chainId)=== 2222 ? "kava" : "") )}]  //TODO - change hardcoded chainid to Mainnet
      }
      //finalListings = [...finalListings, ...listings];
    }
    return finalListings;
  } catch (e) {
    console.log(e);
  }
};

export default LoadAllListingsWatcher;
