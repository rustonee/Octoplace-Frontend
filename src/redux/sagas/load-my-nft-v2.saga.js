import { call, put, takeLatest } from "redux-saga/effects";
import {
  addNFT,
  resetCollections,
  setMyNftLoading,
  setOwner,
} from "../slices/my-nft-slice";
import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function* LoadMyNFTFromAPIWatcher() {
  yield takeLatest("LOAD_MY_NFTS_API", LoadMyNFTFromAPIWorker);
}

function* LoadMyNFTFromAPIWorker(action) {
  try {
    yield put(setMyNftLoading(true));
    yield put(resetCollections());
    yield put(setOwner(action.payload.account));
    const data = yield call(loadNFT, action.payload.account);
    const data2 = yield call(loadKavaNFT, action.payload.account);

    yield put(addNFT(mergeData(data, data2)));
    yield put(setMyNftLoading(false));
  } catch (e) {
    yield put(createAction("LOAD_FAILED")(e));
  }
}

async function loadNFT(account) {
  const result = await axios.get(`${apiUrl}/users/${account}`);
  if (result.data.success) {
    return transformData(result.data.nfts);
  } else {
    throw result.data.message;
  }
}

async function loadKavaNFT(account) {
  const result = await axios.get(`${apiUrl}/users/kava/${account}`);
  if (result.data.success) {
    for (let nft of result.data.nfts) {
      if (!nft.metadata && nft.uri) {
        const metadata = await getMetadata(nft.uri);
        nft.metadata = metadata;
      }
    }
    return transformData(result.data.nfts);
  } else {
    throw result.data.message;
  }
}

const getMetadata = async (uri) => {
  try {
    const result = await axios.get(uri);
    return result.data;
  } catch {}
  return null;
};

function transformData(nfts) {
  return nfts.map((nft) => {
    const item = {
      collectionName: "",
      collectionSymbol: "",
      contractAddress: nft.contract_address,
      tokenId: Number(nft.token_id),
      metadata: nft.metadata ? nft.metadata : null,
      url: nft.uri ? nft.uri : "",
      network: nft.network,
    };
    return item;
  });
}
function mergeData(arr1, arr2) {
  return [...arr1, ...arr2];
}
export default LoadMyNFTFromAPIWatcher;
