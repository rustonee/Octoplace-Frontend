import { Box, Typography } from "@mui/material";
import React from "react";

import verifiedLogo from "../assets/verified.svg";
import flameLogo from "../assets/flame.svg";

function MediaCard({ item, view }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: ".5rem",
        color: "#fff",
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        cursor: "pointer",
        width: "220px",
        //hover
        "&:hover": {
          border: "1px solid #F78C09",
        },
      }}
    >
      <img
        src={item.imageSrc}
        alt={item.name}
        style={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          objectFit: "cover",
          width: "220px",
          height: "220px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          px: "1rem",
          py: ".5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Box>
            <Typography fontSize={14}>{item.name}</Typography>
            <Typography fontSize={10} color="#6C6C6C">
              {item.name}
            </Typography>
          </Box>
          <img src={verifiedLogo} alt="verified" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: ".5rem",
          }}
        >
          <img src={flameLogo} alt="flame" />
          <Typography fontSize={14}>{item.price}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MediaCard;
