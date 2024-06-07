import { createSlice } from "@reduxjs/toolkit";
import { getTxCharge } from "../thunk/get-txcharge";

const initialState = {
  nftAddressList: [],
  isLoading: false,
  isLoadingOffers: false,
  txCharge: 0,
  txDialog: {
    isPending: false,
    isOpen: false,
    isFailed: false,
    isSuccess: false,
    txHash: undefined,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAddressList: (state, action) => {
      state.nftAddressList = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setOffersLoading: (state, action) => {
      state.isLoadingOffers = action.payload;
    },
    setTxCharge: (state, action) => {
      state.txCharge = action.payload;
    },
    showTxDialog: (state) => {
      state.txDialog.isOpen = true;
      state.txDialog.isPending = true;
    },
    hideTxDialog: (state) => {
      state.txDialog.isOpen = false;
      state.txDialog.isPending = false;
      state.txDialog.isSuccess = false;
      state.txDialog.isFailed = false;
      state.txDialog.txHash = undefined;
    },
    setTxDialogHash: (state, action) => {
      state.txDialog.txHash = action.payload;
    },
    setTxDialogPending: (state, action) => {
      state.txDialog.isPending = action.payload;
    },
    setTxDialogSuccess: (state, action) => {
      state.txDialog.isSuccess = action.payload;
    },
    setTxDialogFailed: (state, action) => {
      state.txDialog.isFailed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTxCharge.fulfilled, (state, { payload }) => {
      state.txCharge = payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setAddressList,
  setLoading,
  setOffersLoading,
  setTxCharge,
  showTxDialog,
  hideTxDialog,
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
} = appSlice.actions;

export default appSlice.reducer;
