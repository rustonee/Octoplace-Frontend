import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";
import {  put,  call, takeEvery } from "redux-saga/effects";
import {  metadataUrl } from "../../utils/format-listings";
import { setLoading} from "../slices/app-slice";
import axios from "axios";
import { setAllListings } from "../slices/listing-slice";
import { getNetworkInfo } from "../../connectors/networks";

function* LoadListingNFtWatcher() {
  yield takeEvery("LOAD_LISTING_NFT", LoadListingNFtWorker);
}

function* LoadListingNFtWorker(action) {
  try {
    const listing = yield action.payload;
    yield put(setLoading(true));
    const details = yield call(loadListingNft, listing);
    yield put(setAllListings(details));
    yield put(setLoading(false));
  } catch (e) {
    yield 
    yield put(createAction("LOAD_FAILED")(e));
  }
}

const loadListingNft = async(listing) => {
    const {tokenAddress, tokenId, network} = listing;
    const networkInfo = getNetworkInfo(network);
    const provider = new JsonRpcProvider(networkInfo.dataNetwork.RPC);
    const contract = new Contract(tokenAddress, networkInfo.dataNetwork.ERC_ABI, provider);
    const name  = await contract.name();
    const uri = await contract.tokenURI(tokenId);
    let metadata;
    try{
      const result = await axios.get(metadataUrl(uri));
     metadata = result.data;
    }catch{
      metadata = undefined;
    }
    return {
        listingDetails: listing,
        listingNFT: {
            contractAddress: tokenAddress,
            tokenId: tokenId,
            metadataUri: uri,
            name: name,
            metadata: metadata,
            network: network
        }
    }

}

export default LoadListingNFtWatcher;