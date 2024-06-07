import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCollectionOwner = createAsyncThunk(
  "collection/getCollectionOwner",
  async (collection, thunkAPI) => {
    const result = await axios.get(
      `${apiUrl}/collections/setting/owner`,
      { address: collection.address, network: collection.network }
    );
    // console.log("////////////////// getCollectionOwner ", result.data);
    return result.data;
  }
);
