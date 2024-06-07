import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: 0,
  balance: 0,
  chainId: "",
  isLoggedIn: false,
  token: "",
};

export const accountSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLogin: (state) => {
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.address = "";
      state.balance = 0;
      state.chainId = "";
      state.token = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAddress,
  setBalance,
  setChainId,
  setToken,
  setLogin,
  setLogout,
} = accountSlice.actions;

export default accountSlice.reducer;
