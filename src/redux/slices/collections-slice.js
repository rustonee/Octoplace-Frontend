import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllCollections } from "../thunk/getAllCollections";
import { getAllCollectionNFTs } from "../thunk/get-collection-nfts";
import { getCollectionSettings } from "../thunk/get-collection-setting";
import { getCollectionOwner } from "../thunk/get-collection-owner";
import { getRoyaltyInfo } from "../thunk/get-royalty-info";

const initialState = {
  isLoading: false,
  collections: [],
  selectedCollection: {},
  selectedCollectionSetting: {
    isLoading: false,
    settings: undefined
  },
};

export const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    setSelectedCollection: (state, { payload }) => {
      state.selectedCollection = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCollections.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCollections.fulfilled, (state, { payload }) => {
      state.collections = payload;
      state.isLoading = false;
    });
    builder.addCase(getAllCollections.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading collections.");
    });
    builder.addCase(getAllCollectionNFTs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCollectionNFTs.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.selectedCollection.nfts = payload.nfts;
      state.selectedCollection.totalItems = payload.items;
    });
    builder.addCase(getAllCollectionNFTs.rejected, (state) => {
      state.isLoading = false;
      toast.error("Error occured while loading collection NFTs.");
    });
    builder.addCase(getCollectionSettings.pending,(state) => {
      state.selectedCollectionSetting.isLoading = true;
    } )
    builder.addCase(getCollectionSettings.fulfilled, (state, { payload }) => {
      state.selectedCollectionSetting.isLoading = false;
      state.selectedCollectionSetting.settings = payload
    });
    builder.addCase(getCollectionSettings.rejected, (state) => {
      state.selectedCollectionSetting.isLoading = false;
      toast.error("Error occured while loading collection Settings.");
    });
    builder.addCase(getCollectionOwner.fulfilled, (state, { payload }) => {
      state.selectedCollectionSetting.owner = payload.ownerAddress
    });
    builder.addCase(getCollectionOwner.rejected, (state) => {
      toast.error("Error occured while loading collection Owner address.");
    });
    builder.addCase(getRoyaltyInfo.fulfilled, (state, { payload }) => {
      state.selectedCollectionSetting.royalty = payload
    });
    builder.addCase(getRoyaltyInfo.rejected, (state) => {
      toast.error("Error occured while loading collection royalty information.");
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setCollections, setSelectedCollection } =
  collectionsSlice.actions;

export default collectionsSlice.reducer;
