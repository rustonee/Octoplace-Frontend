import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const getCollectionSettings = createAsyncThunk(
  "collection/getCollectionSettings",
  async (collection, thunkAPI) => {
    //  await axios.post(`${apiUrl}/collection-setting/create-collection-setting`,{address: collection.address, network:collection.network});
    // const result = await axios.post(`${apiUrl}/collection-setting/get-collection-setting`,{address: collection.address, network:collection.network});
    const result = await axios.get(`${apiUrl}/collections/listOne/${collection.network}/${collection.address}`);
    return result.data;
  }
);