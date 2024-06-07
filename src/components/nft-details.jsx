import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { ExpandMore, ListAlt } from "@mui/icons-material";
import { shortenAddress } from "../utils/string-util";

export const NFTDetails = ({ metadata, address, tokenId, chainId }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const styles = {
    accordion2: {
      backgroundColor: "transparent",
      color: expanded ? "#f4f4f4" : "#6c6c6c",
      border: "1px solid  #6C6C6C",
      borderRadius: ".5rem",
      marginBottom: "1rem",
      "&:hover": {
        border: "1px solid #f4f4f4",
        color: "#f4f4f4",
      },
      "&:hover .MuiSvgIcon-root": {
        color: "#f4f4f4",
      },
    },
    accordionHeader: {
      fontWeight: 400,
      fontsize: "1.125rem",
      lineHeight: "105.02%",
    },
    accordionBody: {
      backgroundColor: "#151515",
      display: "flex",
      flexDirection: "column",
      borderRadius: ".5rem",
      gap: 1,
    },
    h1: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    p: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 1,
    },
    chip: {
      color: "#f4f4f4",
      border: "1px solid #3D3D3D",
      px: 2,
      py: 1,
      fontSize: "1rem",
      fontWeight: 400,
      borderRadius: ".75rem",
      textAlign: "center",
    },
    detailsBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
      fontSize: "1rem",
      fontWeight: 400,
    },
    left: {
      display: "flex",
      justifyContent: "flex-start",
      width: "20vw",
    },
    right: {
      display: "flex",
      justifyContent: "flex-end",
    },
    capitalize: {
      textTransform: "capitalize",
    },
  };

  return (
    <Accordion
      sx={styles.accordion2}
      variant="outlined"
      expanded={expanded}
      onChange={handleChange}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMore sx={{ color: expanded ? "#f4f4f4" : "#6c6c6c" }} />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={styles.accordionHeader}>
          <ListAlt /> &nbsp;&nbsp;Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionBody}>
        <Typography sx={styles.h1}>About</Typography>
        <Typography sx={styles.p}>{metadata?.description}</Typography>
        <Typography sx={styles.h1}>Attributes</Typography>
        <Box sx={styles.row}>
          {metadata?.attributes?.map((item) => (
            <Box key={item.trait_type} sx={styles.chip}>
              <small style={{ fontSize: "11.2px" }}>
                {item.trait_type.toUpperCase()}
              </small>
              <br />
              {!item.value
                ? "None"
                : item.value && typeof item.value !== "object"
                ? item.value
                : JSON.stringify(item.value)}
            </Box>
          ))}
        </Box>
        <Box sx={styles.detailsBox}>
          <Box sx={styles.row}>
            <Box sx={styles.left}>Contract Address</Box>
            <Box sx={styles.right}>{shortenAddress(address)}</Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.left}>Token ID</Box>
            <Box sx={styles.right}>{tokenId}</Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.left}>Token Standard</Box>
            <Box sx={styles.right}>ERC-721</Box>
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.left}>Network</Box>
            <Box sx={[styles.right, styles.capitalize]}>{chainId}</Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
