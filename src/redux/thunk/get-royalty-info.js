import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getRoyaltyInfo = createAsyncThunk(
  "collection/getRoyaltyInfo",
  async (collection, thunkAPI) => {
    const result =  await axios.post(`${apiUrl}/collection-setting/get-royalty-info`,{address: collection.address, network:collection.network});
    console.log(result.data);
    return result.data;
  }
);