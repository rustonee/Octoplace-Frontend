/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState } from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import ercAbi from "../../abi/erc721.json";
import axios from "axios";
import { metadataUrl } from "../../utils/format-listings";
import { getImageUrl } from "../../utils/string-util";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { getNetworkInfo } from "../../connectors/networks";

export const OfferItem = (props) => {
  const { offer, serial, network } = props;
  const [name, setName] = useState("");
  const [imgUrl, setUrl] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const getOfferNft = async () => {
    const netInfo = getNetworkInfo(network);
    const provider = new JsonRpcProvider(netInfo.dataNetwork.RPC);
    const contract = new Contract(offer.offerTokenAddress, ercAbi, provider);
    const nm = await contract.name();
    setName(nm);
    const uri = await contract.tokenURI(offer.offerTokenId);
    let meta = undefined;
    try {
      const res = await axios.get(metadataUrl(uri));
      meta = res.data;
    } catch {
      meta = undefined;
    }
    try {
      if (meta.image) {
        setUrl(getImageUrl(meta.image));
      }
    } catch {
      setUrl(
        "data:image/png;base64,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"
      );
    }
  };

  useLayoutEffect(() => {
    getOfferNft();
  }, []);

  return (
    <Fragment>
      <Grid
        onClick={() => navigate(`/swap/${network}/${offer.offerId}`)}
        container
        spacing={1}
        sx={{
          ml: 1,
          pb: 1,
          pr: 0,
          mt: 2,
          mr: 1,
          alignItems: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#6c6c6c",
          },
        }}
      >
        <Grid item sx={{ ml: 1 }} xs={1}>
          <Typography>{serial}</Typography>
        </Grid>
        <Grid item xs={3}>
          <img
            alt="nsbjhvx"
            src={imgUrl}
            style={{
              width: "100px",
              maxHeight: "100px",
              objectFit: "cover",
              borderRadius: "12px",
              display: imgLoaded ? "block" : "none",
            }}
            onLoad={() => setImgLoaded(true)}
          />
          {!imgLoaded && (
            <Box
              sx={{
                width: "100px",
                height: "100px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Grid>
        <Grid item xs={2}>
          <Typography sx={{ alignSelf: "center" }}>
            {offer.offerTokenId}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography
            sx={{
              alignSelf: "center",
              color: "white",
              fontSize: "15px",
            }}
          >
            {name}
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};
