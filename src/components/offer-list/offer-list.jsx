/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, FormatListBulleted } from "@mui/icons-material";
import { useEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatOffers } from "../../utils/format-listings";
import { OfferItem } from "./offer-item";
import { getNetworkInfo } from "../../connectors/networks";

export const OfferList = (props) => {
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
      gap: 1,
      maxHeight: "470px",
      overflowY: "scroll",
      borderRadius: ".5rem",
    },
    tableItem: {
      borderBottom: "1px solid #6c6c6c",
      pb: 2,
      mt: 2,
    },
  };

  const { listingId, network } = props;
  const [offers, setPOffers] = useState([]);
  const getAllOffers = async () => {
    const net = getNetworkInfo(network);
    const provider = new JsonRpcProvider(net.dataNetwork.RPC);
    const contract = new Contract(
      net.dataNetwork.SWAP_CONTRACT,
      net.dataNetwork.SWAP_ABI,
      provider
    );
    const offer = await contract.readAllOffers();
    setPOffers(formatOffers(offer).filter((x) => x.listingId === listingId));
  };

  useEffect(() => {
    if (listingId) {
      getAllOffers();
    }
  }, [listingId]);

  return (
    <Accordion
      sx={styles.accordion2}
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
          <FormatListBulleted /> &nbsp;&nbsp;Offers
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionBody}>
        <Grid container spacing={1}>
          <Grid item sx={styles.tableItem} xs={2}>
            <Typography>No</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={2}>
            <Typography>title</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={1}>
            <Typography>#</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={2}>
            <Typography>owner</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={1}>
            <Typography>floor</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={2}>
            <Typography>price</Typography>
          </Grid>
          <Grid item sx={styles.tableItem} xs={2}></Grid>

          {offers.filter(
            (x) =>
              x.isDeclined === false &&
              x.isCancelled === false &&
              x.isCompleted === false
          ).length === 0 && (
            <Grid item xs={12}>
              <Typography>No available offers.</Typography>
            </Grid>
          )}

          {offers
            .filter(
              (x) =>
                x.isDeclined === false &&
                x.isCancelled === false &&
                x.isCompleted === false
            )
            .map((item, index) => {
              return (
                <OfferItem
                  network={network}
                  serial={index + 1}
                  key={item.offerId}
                  offer={item}
                />
              );
            })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
