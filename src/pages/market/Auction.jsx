import React from "react";
import MarketMenu from "../../components/MarketMenu";

function Auction({ isHome }) {
  return <div>{!isHome && <MarketMenu />}</div>;
}

export default Auction;
