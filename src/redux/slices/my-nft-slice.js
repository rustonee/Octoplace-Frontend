import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  nftCollections: [],
  nfts: [],
  nftListings: [],
  offers: [],
  ownerAddress: "noowner",
  selectedTab: 0,
};

export const myNFTSlice = createSlice({
  name: "myNFT",
  initialState,
  reducers: {
    addNFTCollection: (state, action) => {
      state.nftCollections = action.payload;
    },
    addNFT: (state, action) => {
      state.nfts = action.payload;
    },
    addMyListings: (state, action) => {
      state.nftListings = action.payload;
    },
    updateNFT: (state, action) => {
      for (let i = 0; i < state.nfts.length; i++) {
        let obj = state.nfts[i];
        if (
          obj.contractAddress === action.payload.address &&
          obj.tokenId === action.payload.tokenId
        ) {
          state.nfts[i].metadata = action.payload.metadata;
        }
      }
    },
    resetCollections: (state) => {
      state.nftCollections = [];
      state.nfts = [];
      state.nftListings = [];
      state.ownerAddress = "noower";
    },
    setMyNftLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setOwner: (state, action) => {
      state.ownerAddress = action.payload;
    },
    setMyOffers: (state, action) => {
      state.offers = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedTab,
  updateNFT,
  addNFTCollection,
  resetCollections,
  addNFT,
  addMyListings,
  setMyNftLoading,
  setMyOffers,
  setOwner,
} = myNFTSlice.actions;

export default myNFTSlice.reducer;
