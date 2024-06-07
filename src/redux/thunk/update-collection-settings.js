import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCollectionSettings } from "./get-collection-setting";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

export const updateCollectionSettings = createAsyncThunk(
  "collection/updateCollectionSettings",
  async (updateObj, thunkAPI) => {
    if(updateObj.avatar){
        await axios.post(`${apiUrl}/collection-setting/update-collection-avatar`,{address: updateObj.address, network:updateObj.network, avatar: updateObj.avatar.data});
        console.log("avatar updated")
    }
    if(updateObj.avatar){
        await axios.post(`${apiUrl}/collection-setting/update-collection-banner`,{address: updateObj.address, network:updateObj.network, banner: updateObj.banner.data});
        console.log("banner updated")
    }
    await axios.post(`${apiUrl}/collection-setting/update-collection-settings`,updateObj);
    toast.success("Collection Settings Updated");
    console.log("dettings updated");

    thunkAPI.dispatch(getCollectionSettings({address: updateObj.address, network: updateObj.network}))
  }
);