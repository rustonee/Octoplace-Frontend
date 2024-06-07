import { spawn} from "redux-saga/effects"
import LoadListingNFtWatcher from "./sagas/load-listing-nft";
import LoadAllListingsWatcher from "./sagas/load-listings";
import LoadMyNFTFromAPIWatcher from "./sagas/load-my-nft-v2.saga";
import loadMyFT from "./sagas/load-my-nft.saga"
import LoadAllOffersWatcher from "./sagas/load-offers";
export function* rootSaga() {
   // yield spawn(GetMyNFTSagaWatcher);
    yield spawn(loadMyFT);
    yield spawn(LoadAllListingsWatcher);
    yield spawn(LoadListingNFtWatcher);
    yield spawn(LoadAllOffersWatcher);
    yield spawn(LoadMyNFTFromAPIWatcher);
}