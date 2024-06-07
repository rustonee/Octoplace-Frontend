/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Paper, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { Tabs, Tab, TabsList, TabPanel } from "@mui/base"
import { Container, Row, Col } from "react-bootstrap";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import { Fragment, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Refresh } from "@mui/icons-material";
import { ActiveListings } from "./components/active";
import { setSelectedTab } from "../../redux/slices/listing-slice";
import { CompletedSwaps } from "./components/done-trades";
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

export const Listings = () => {
  const [view, setView] = useState(3);
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  const isLoading = useSelector((state) => state.app.isLoading);
  const selectedTab = useSelector((state) => state.listings.selectedTab);
  const getListings = async () => {
    if (listings.length === 0) {
      dispatch({ type: "LOAD_ALL_LISTING" });
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Tabs defaultValue={selectedTab}>
            <Box sx={{ display: "flex", marginBottom: "24px", mt: "48px" }}>
              <StyledTabsList>
                <StyledTab onClick={() => dispatch(setSelectedTab(0))}>
                  Active Listings
                </StyledTab>
                <StyledTab onClick={() => dispatch(setSelectedTab(1))}>
                  Swap Completed
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
                {selectedTab !== 1 && (
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
                      <Refresh
                        sx={{ p: 1, cursor: "pointer", fontSize: "2.2em" }}
                        onClick={() => {
                          getListings();
                        }}
                      />
                    </Box>
                  </Paper>
                )}
              </Box>
            </Box>
            <StyledTabPanel sx={{ minHeight: "60vh" }} value={0}>
              <Fragment>
                {listings && listings.length > 0 && (
                  <ActiveListings view={view} />
                )}
                {isLoading && (
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
              </Fragment>
            </StyledTabPanel>
            <StyledTabPanel sx={{ minHeight: "60vh" }} value={1}>
              <Fragment>
                <CompletedSwaps />
              </Fragment>
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
