import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";
import { takeLatest, put, call } from "redux-saga/effects";
import { rpc } from "../../connectors/address";
import abi from "../../abi/erc721.json";
import { formatUnits } from "@ethersproject/units";
import axios from "axios";
import { metadataUrl } from "../../utils/format-listings";
import {
  addNFT,
  addNFTCollection,
  resetCollections,
  setMyNftLoading,
  setOwner,
} from "../slices/my-nft-slice";
function* LoadMyNFTSagaWatcher() {
  yield takeLatest("LOAD_MY_NFTS", LoadMyNFTWorker);
}

function* LoadMyNFTWorker(action) {
  try {
    yield put(setMyNftLoading(true));
    yield put(setOwner(action.payload.account));
    yield put(resetCollections());
    const data = yield call(
      loadNFT,
      action.payload.nftAddrList,
      action.payload.account
    );
    yield put(addNFTCollection(data.collections));
    yield put(addNFT(data.nfts));
    yield put(setMyNftLoading(false));
  } catch (e) {
    yield;
    yield put(createAction("LOAD_FAILED")(e));
  }
}
async function loadNFT(addresses, owner) {
  const nfts = [];
  const collections = [];
  const provider = new JsonRpcProvider(rpc);

  for (const item of addresses) {
    const contract = new Contract(item.address, abi, provider);
    const collectionName = await contract.name();
    const colSymbol = await contract.symbol();
    const balance = await contract.balanceOf(owner);

    collections.push({
      address: contract.address,
      name: collectionName,
      symbol: colSymbol,
      balance: Number(formatUnits(balance, 0)),
    });
  }
  for (const collection of collections) {
    if (collection.balance > 0) {
      for (let i = 0; i < collection.balance; i++) {
        let tokenId;
        let uri;
        const contract = new Contract(collection.address, abi, provider);
        try {
          tokenId = await contract.tokenOfOwnerByIndex(owner, i);
          uri = await contract.tokenURI(Number(formatUnits(tokenId, 0)));
          let tokenData;
          try {
            const result = await axios.get(metadataUrl(uri));
            tokenData = result.data;
          } catch {
            tokenData = undefined;
          }

          nfts.push({
            collectionName: collection.name,
            collectionSymbol: collection.symbol,
            contractAddress: collection.address,
            tokenId: Number(formatUnits(tokenId, 0)),
            url: uri,
            metadata: tokenData,
          });
        } catch (e) {
          nfts.push({
            collectionName: collection.name,
            collectionSymbol: collection.symbol,
            contractAddress: collection.address,
            tokenId: Number(formatUnits(tokenId, 0)),
            url: uri,
            metadata: undefined,
          });
        }
      }
    }
  }
  return { collections, nfts };
}

export default LoadMyNFTSagaWatcher;
