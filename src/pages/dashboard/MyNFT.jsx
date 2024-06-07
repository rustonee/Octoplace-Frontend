/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { Tabs, Tab, TabsList, TabPanel } from "@mui/base";
import { Container, Row, Col } from "react-bootstrap";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { resetCollections } from "../../redux/slices/my-nft-slice";
import { NFTCard } from "../../components/NFTCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import { createAction } from "@reduxjs/toolkit";
import { MyListedNFT } from "./my-listed-nft";
import { MyOffers } from "./my-offers";
import { setSelectedTab } from "../../redux/slices/my-nft-slice";

const StyledTab = styled(Tab)`
  color: #6c6c6c;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  background-color: #262626;
  padding: 8px 24px;
  border-radius: 12px;
  border: none;
  display: flex;
  margin-right: 8px;
  &.Mui-selected {
    font-size: 14px;
    color: #262626;
    background-color: #f4f4f4;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
`;

const StyledTabsList = styled(TabsList)`
  background-color: #262626;
  padding: 0 8px 0 8px;
  margin-bottom: 10px;
  display: flex;
  align-content: space-evenly;
  border-radius: 8px;
  width: 900px;
  @media only screen and (max-width: 900px) {
    width: 90%;
  }
`;

export const MyNFT = () => {
  const [view, setView] = useState(3);
  const loading = useSelector((state) => state.myNFT.isLoading);
  const { account, library } = useWeb3React();
  const nfts = useSelector((state) => state.myNFT.nfts);
  const selectedTab = useSelector((state) => state.myNFT.selectedTab);
  const dispatch = useDispatch();

  const getNFTDetails = async () => {
    if (nfts.length === 0) {
      dispatch(createAction("LOAD_MY_NFTS_API")({ account }));
    }
  };

  useEffect(() => {
    if (account && library) {
      getNFTDetails();
    }
  }, [account, library]);

  const handleRefresh = async () => {
    if (account && library) {
      dispatch(resetCollections());
      getNFTDetails();
    }
  };
  return (
    <Container>
      <Row>
        <Col>
          <Tabs defaultValue={selectedTab}>
            <Box sx={{ display: "flex", marginBottom: "24px", mt: "48px" }}>
              <StyledTabsList>
                <StyledTab onClick={() => dispatch(setSelectedTab(0))}>
                  My NFTs
                </StyledTab>
                <StyledTab onClick={() => dispatch(setSelectedTab(1))}>
                  Listed
                </StyledTab>
                <StyledTab onClick={() => dispatch(setSelectedTab(2))}>
                  Offers
                </StyledTab>
              </StyledTabsList>
              <Box
                sx={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "12px",
                  justifyContent: "flex-end",
                  display: "flex",
                  "& .MuiSvgIcon-root": { color: "#262626" },
                }}
              >
                <Paper sx={{ borderRadius: "10px" }}>
                  <Box display="flex" flexDirection="row">
                    <WindowOutlinedIcon
                      sx={{ p: 1, cursor: "pointer", fontSize: "2.2em" }}
                      onClick={() => setView(6)}
                    />
                    <Divider
                      sx={{ borderColor: "black" }}
                      orientation="vertical"
                      variant="middle"
                      flexItem
                    />
                    <GridOnOutlinedIcon
                      sx={{ p: 1, cursor: "pointer", fontSize: "2.2em" }}
                      onClick={() => setView(3)}
                    />
                    <Divider
                      sx={{ borderColor: "black" }}
                      orientation="vertical"
                      variant="middle"
                      flexItem
                    />
                    <RefreshIcon
                      sx={{ p: 1, cursor: "pointer", fontSize: "2.2em" }}
                      onClick={() => handleRefresh()}
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>
            <StyledTabPanel sx={{ minHeight: "60vh" }} value={0}>
              <Grid container spacing={2}>
                {!account && (
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginTop: "10vh",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: "grey", textAlign: "center" }}
                    >
                      Connect your wallet to browse your NFT's.
                    </Typography>
                  </div>
                )}
                {account && nfts.length === 0 && !loading && (
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginTop: "10vh",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: "grey", textAlign: "center" }}
                    >
                      You do not have any NFT's in your wallet.
                    </Typography>
                  </div>
                )}
                {view !== 1 &&
                  nfts.map((item, index) => {
                    return (
                      <Grid
                        key={`index_${index}`}
                        item
                        xs={12}
                        sm={6}
                        md={view}
                      >
                        {<NFTCard nft={item} view={view} where="" />}
                      </Grid>
                    );
                  })}
                {loading && account && (
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginTop: "10vh",
                    }}
                  >
                    <CircularProgress color="primary" />
                  </div>
                )}
              </Grid>
            </StyledTabPanel>
            <StyledTabPanel sx={{ minHeight: "60vh" }} value={1}>
              <MyListedNFT view={view} />
            </StyledTabPanel>
            <StyledTabPanel sx={{ minHeight: "60vh" }} value={2}>
              <MyOffers view={view} />
            </StyledTabPanel>
          </Tabs>
        </Col>
        <Row>
          <Col></Col>
        </Row>
      </Row>
    </Container>
  );
};
