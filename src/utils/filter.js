export function filterListedNFTs(nfts, activeListings, activeOffers) {
  const result = [];
  nfts.forEach((nft) => {
    const found = activeListings.find(
      (x) =>
        Number(x.listingDetails.tokenId) === Number(nft.tokenId) &&
        x.listingDetails.tokenAddress.toLowerCase() ===
          nft.contractAddress.toLowerCase() &&
        x.network === nft.network &&
        !x.listingDetails.isCompleted &&
        !x.listingDetails.isCancelled
    );
    const found2 = activeOffers.find(
      (x) =>
        x.isCompleted === false &&
        x.isCancelled === false &&
        Number(x.offerTokenId) === Number(nft.tokenId) &&
        x.offerTokenAddress.toLowerCase() ===
          nft.contractAddress.toLowerCase() &&
        x.network === nft.network
    );
    if (!found) {
      if (!found2) {
        result.push(nft);
      }
    }
  });
  return result;
}
