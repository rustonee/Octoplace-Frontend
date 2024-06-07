import { formatUnits } from "@ethersproject/units";

const listingId = 0;
const tokenAddress = 1;
const tokenId = 2;
const tokenOwner = 3;
const transactionChargeBips = 4;
const isCompleted = 5;
const isCancelled = 6;
const transactionCharge = 7;
export const formatListings = (listings) => {
  const formatted = listings.map((listing) => {
    const obj = {
      listingid: Number(formatUnits(listing[listingId], 0)),
      tokenAddress: listing[tokenAddress],
      tokenId: Number(formatUnits(listing[tokenId], 0)),
      tokenOwner: listing[tokenOwner],
      transactionChargeBips: Number(
        formatUnits(listing[transactionChargeBips], 0)
      ),
      isCompleted: listing[isCompleted],
      isCancelled: listing[isCancelled],
      transactionCharge: Number(formatUnits(listing[transactionCharge], 0)),
    };
    return obj;
  });
  return formatted;
};

export function formatOffers(offers, network) {
  const formatted = offers.map((item) => {
    const obj = {
      isCancelled: item.isCancelled,
      isCompleted: item.isCompleted,
      isDeclined: item.isDeclined,
      listingId: Number(formatUnits(item.listingId, 0)),
      listingTokenAddress: item.listingTokenAddress,
      listingTokenId: Number(formatUnits(item.listingTokenId, 0)),
      listingTokenOwner: item.listingTokenOwner,
      offerId: Number(formatUnits(item.offerId, 0)),
      offerTokenAddress: item.offerTokenAddress,
      offerTokenId: Number(formatUnits(item.offerTokenId, 0)),
      offerTokenOwner: item.offerTokenOwner,
      transactionCharge: Number(formatUnits(item.transactionCharge, 0)),
      transactionChargeBips: Number(formatUnits(item.transactionChargeBips, 0)),
      network: network,
    };
    return obj;
  });

  return formatted;
}
export const getActiveListings = (listings) => {
  return listings.filter(
    (x) =>
      x.listingDetails.isCompleted === false &&
      x.listingDetails.isCancelled === false
  );
};

export const sortListigs = (listings, order) => {
  //order 1 - Newest 0 - Oldest
  let sorted =[];
  switch (order) {
    case 1:
      sorted = listings.slice().sort(
        (a, b) => a.listingDetails.listingid - b.listingDetails.listingid
      );
      
      break;
    case 0:
      sorted = listings.slice().sort(
        (a, b) => b.listingDetails.listingid - a.listingDetails.listingid
      );
      break;
    default:
      listings.slice().sort(
        (a, b) => a.listingDetails.listingid - b.listingDetails.listingid
      );
      break;
  }
  return sorted;
};

export const getCompletedListings = (listings) => {
  return listings.filter((x) => x.isCompleted === true);
};

export function metadataUrl(uri) {
  let url = "";
  if (uri.includes("ipfs://")) {
    url = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    url = uri;
  }
  return url;
}

export const FormatTrades = (trades) => {
  const tradeId = 0;
  const listingId = 1;
  const offerId = 2;

  const formatted = trades.map((trade) => {
    const data = {
      tradeId: Number(formatUnits(trade[tradeId], 0)),
      listingId: Number(formatUnits(trade[listingId], 0)),
      offerId: Number(formatUnits(trade[offerId], 0)),
    };
    return data;
  });
  return formatted;
};
