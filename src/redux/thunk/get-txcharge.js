import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getTxCharge = createAsyncThunk(
  "app/getTxCharge",
  async (network,thunkAPI) => {
    let txCharge = 0;
    
      const provider = new JsonRpcProvider(network.RPC);
      const contract = new Contract(network.SWAP_CONTRACT, network.SWAP_ABI, provider);
      txCharge = await contract.getTxCharge();
      
    return txCharge;
  }
);
