import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NETWORKS } from "../../connectors/networks";
import {
  FormatTrades,
  formatListings,
  formatOffers,
} from "../../utils/format-listings";
export const getAllTrades = createAsyncThunk(
  "trades/getAllTrades",
  async (thunkAPI) => {
    const detailedTrades = [];
    const nets = [NETWORKS.THETA, NETWORKS.KAVA];
    for (var net of nets) {
      const provider = new JsonRpcProvider(net.RPC);
      const chainId = net.CHAIN_ID;
      const contract = new Contract(net.SWAP_CONTRACT, net.SWAP_ABI, provider);
      let trades = await contract.readAllTrades();
      trades = FormatTrades(trades);

      for (const trade of trades) {
        let listing = await contract.readListingById(trade.listingId);
        let offer = await contract.readOfferById(trade.offerId);
        listing = formatListings([listing])[0];
        offer = formatOffers([offer])[0];

        detailedTrades.push({
          tradeId: trade.tradeId,
          listing,
          offer,
          network: (parseInt(chainId) === 361 ? "theta" : (parseInt(chainId)=== 2222 ? "kava" : "") ) //TODO Remove hardcoded ChainId
        });
      }
    }
    return detailedTrades;
  }
);
