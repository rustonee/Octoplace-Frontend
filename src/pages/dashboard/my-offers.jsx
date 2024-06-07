/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMyOffers } from "../../redux/slices/my-nft-slice";
import { Tabs, Tab, TabsList, TabPanel } from "@mui/base";
import { styled } from "@mui/system";
import { MyOfferItem } from "./components/my-offer-item";

export const MyOffers = (props) => {
  const { account } = useWeb3React();
  const loading = useSelector((state) => state.app.isLoadingOffers);
  const offers = useSelector((state) => state.listings.offers);
  const myOffers = useSelector((state) => state.myNFT.offers);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (offers.length > 0 && account) {
      const result = offers.filter(
        (x) => x.offerTokenOwner === account || x.listingTokenOwner === account
      );
      dispatch(setMyOffers(result));
    }
  }, [offers, account]);

  return (
    <Grid container spacing={2}>
      {!account && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <Typography variant="h4" sx={{ color: "grey", textAlign: "center" }}>
            Connect your wallet to browse your offers.
          </Typography>
        </div>
      )}
      {account && offers.length === 0 && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <Typography variant="h4" sx={{ color: "grey", textAlign: "center" }}>
            You have not listed any NFT's.
          </Typography>
        </div>
      )}
      {!loading && account && offers.length > 0 && (
        <>
          <Grid sx={{ m: 2 }} container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Tabs value={value} onChange={handleChange}>
                <Box sx={{ display: "flex", marginBottom: "24px", mt: -1 }}>
                  <StyledTabsList>
                    <StyledTab>Received</StyledTab>
                    <StyledTab>Sent</StyledTab>
                  </StyledTabsList>
                </Box>
                <StyledTabPanel value={0}>
                  <Grid container>
                    {myOffers
                      .filter((x) => x.listingTokenOwner === account)
                      .map((item) => (
                        <Grid key={item.offerId} sx={{ marginLeft: "16px" }} item xs={12}>
                          <Box
                            sx={{
                              height: "240px",
                              backgroundColor: "#6c6c6c",
                              borderRadius: "12px",
                              mb:2,
                              p:2
                            }}
                            width="100%"
                            display="flex"
                          >
                            <MyOfferItem item={item} />
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </StyledTabPanel>
                <StyledTabPanel value={1}>
                  <Grid container>
                    {myOffers
                      .filter((x) => x.offerTokenOwner === account)
                      .map((item) => (
                        <Grid sx={{ marginLeft: "16px" }} item xs={12}>
                          <Box
                            sx={{
                              height: "240px",
                              backgroundColor: "#6c6c6c",
                              borderRadius: "12px",
                              p:2,
                                mb:2
                            }}
                            width="100%"
                            display="flex"
                          >
                            <MyOfferItem item={item} />
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </StyledTabPanel>
              </Tabs>
            </Grid>
          </Grid>
        </>
      )}
      {loading && (
        <div style={{ textAlign: "center", width: "100%", marginTop: "10vh" }}>
          <CircularProgress color="primary" />
        </div>
      )}
    </Grid>
  );
};

const StyledTab = styled(Tab)`
  color: #6c6c6c;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  background-color: #262626;
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  display: flex;
  margin-right: 8px;
  &.Mui-selected {
    font-size: 18px;
    text-transform: uppercase;
    color: white;
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
  align-items: center;
  border-radius: 8px;
  width: 900px;
  @media only screen and (max-width: 900px) {
    width: 90%;
  }
`;
