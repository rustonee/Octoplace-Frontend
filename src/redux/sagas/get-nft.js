import { createAction } from "@reduxjs/toolkit";
import { takeLeading, put, all } from "redux-saga/effects";

function* GetMyNFTSagaWatcher() {
  yield takeLeading("GET_MY_NFTS", GetMyNFTWorker);
}

function* GetMyNFTWorker(action) {
  try {
    yield all(action.payload.nftAddrList.map(item => put(createAction("LOAD_MY_NFT")({address:item.address, account:action.payload.account}))))
  } catch (e) {
    yield 
    yield put(createAction("LOAD_FAILED")(e));
  }
}


export default GetMyNFTSagaWatcher;
