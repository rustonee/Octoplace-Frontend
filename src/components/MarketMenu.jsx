import { Box } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";

// const styles = {
//   root: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     gap: "3rem",
//   },
//   btn: {
//     fontWeight: 400,
//     fontSize: "1.5rem",
//     lineHeight: "105.02%",
//     color: "#6C6C6C",
//     textDecoration: "none",
//   },
//   activeBtn: {
//     fontWeight: 400,
//     fontSize: "1.5rem",
//     lineHeight: "105.02%",
//     color: "#f4f4f4",
//     textDecoration: "none",
//     position: "relative",
//     overflow: "hidden",
//     "&:after": {
//       content: "''",
//       position: "absolute",
//       left: 0,
//       bottom: 0,
//       width: "100%",
//       height: "2px",
//       backgroundColor: "#f78C09",
//       transform: "translateX(-100%)",
//       transition: "transform 300ms ease",
//     },
//     "&:hover": {
//       "&:after": {
//         transform: "translateX(0)",
//       },
//     },
//   },
// };

function MarketMenu({ activeTabRef }) {
  const location = useLocation();

  return (
    <Box className="market-menu">
      <Link
        to="/market"
        className={
          location.pathname === "/market" ? "active-button" : "regular-btn"
        }
      >
        Market
      </Link>
      <Link
        to="/market/swap"
        className={
          location.pathname === "/market/swap" ? "active-button" : "regular-btn"
        }
      >
        Swap
      </Link>
      <Link
        // to="/market/auction"
        style={{ color: "rgb(108, 108, 108)" }}
        className={
          location.pathname === "/market/auction"
            ? "active-button"
            : "regular-btn-disabled"
        }
      >
        Auction
      </Link>
    </Box>
  );
}

export default MarketMenu;
