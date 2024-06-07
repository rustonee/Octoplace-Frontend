import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import accountReducer from "./slices/accout-slice";
import appReducer from "./slices/app-slice";
import myNftSlice from "./slices/my-nft-slice";
import listingSlice from "./slices/listing-slice";
import tradeReducer from "./slices/trades-slice";
import marketSlice from "./slices/market-slice";
import collectionsSlice from "./slices/collections-slice";
import discussionSlice from "./slices/discussions-slice";
import analyticsSlice from "./slices/analytics-slice";

import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./saga";

let sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

export const store = configureStore({
  reducer: {
    account: accountReducer,
    app: appReducer,
    myNFT: myNftSlice,
    listings: listingSlice,
    trades: tradeReducer,
    market: marketSlice,
    collection: collectionsSlice,
    discussion: discussionSlice,
    analytics: analyticsSlice,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);
