/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MarketMenu from "../../components/MarketMenu";
import { useDispatch, useSelector } from "react-redux";
import { setActiveListings } from "../../redux/slices/listing-slice";
import { getActiveListings, sortListigs } from "../../utils/format-listings";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { NFTListingCard } from "../listings/components/ListingCard";
import { Container } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import TuneIcon from "@mui/icons-material/Tune";
import FilterComponent from "../../components/FilterComponent";
import Searchbox from "../../components/searchbox";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: ".3rem 1rem",
    fontSize: ".9rem",
    borderRadius: ".75rem",
    position: "relative",
    color: "#f4f4f4",
    backgroundColor: "transparent",
    border: "1px solid #ced4da",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: ".75rem",
      borderColor: "#ced4da",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

function Swap({ isHome }) {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  const activeListings = useSelector((state) => state.listings.activeListings);
  const [view, setView] = useState(2);
  const [orderMethod, setOrderMethod] = useState("Newest");
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  // const [loading, setLoading] = useState(true);
  const [filterObj, setFilterObj] = useState({
    minPrice: 0,
    maxPrice: 0,
    blockchain: "empty",
    collection: "empty",
    saleOnly: false,
    auctionOnly: false,
    offersReceived: false,
    includeBurned: false,
  });

  const handleOrder = (event) => {
    setOrderMethod(event.target.value);
    switch (orderMethod) {
      case "Newest":
        dispatch(setActiveListings(sortListigs(activeListings, 1)));
        return;
      case "Oldest":
        dispatch(setActiveListings(sortListigs(activeListings, 0)));
        return;
      default:
        dispatch(setActiveListings(sortListigs(activeListings, 1)));
        return;
    }
  };

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      const sorted = sortListigs(active, 0);
      dispatch(setActiveListings(sorted));
      setIsLoading(false);
    }
  }, [listings]);
  /*
  const fetchData = () => {
    // When this function runs, add the next 6 new items to the active listing directory. If we are at the end of the list, set setHasMore to false.
    if (activeListings.length >= listings.length) {
      console.log("No more listings to fetch");
      // setHasMore(false);
      return;
    }
    // Calculate the index range for the next 6 items
    const startIndex = activeListings.length;
    const endIndex = Math.min(startIndex + 6, listings.length);
    // Fetch the new items or generate them
    const newItems = fetchNextItems(startIndex, endIndex); // Replace with your own logic
    // Add the new items to the active listings
    const updatedListings = [...activeListings, ...newItems];
    // Update the active listings state
    dispatch(setActiveListings(updatedListings));
  };

  const fetchNextItems = (startIndex, endIndex) => {
    const newItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      newItems.push(listings[i]);
    }
    return newItems;
  };

  const refresh = () => {
    setTimeout(() => {
      dispatch(setActiveListings(activeListings.concat(activeListings)));
    }, 1500);
  };
*/
  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const handleFilter = (filterObj) => {
    setFilterObj(filterObj);
  };

  const filteredSwapItems = activeListings.filter((item, index) => {
    const selItem = item.listingNFT;

    if (!selItem.metadata) {
      return false;
    }

    if (
      selItem.name &&
      !selItem.name.toLowerCase().includes(keyword.toLowerCase())
    ) {
      return false;
    }

    if (
      filterObj.blockchain !== "empty" &&
      selItem.network.toLowerCase() !== filterObj.blockchain
    ) {
      return false;
    }

    if (
      filterObj.collection !== "empty" &&
      selItem.contractAddress.toLowerCase() !==
        filterObj.collection.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // if (isLoading) {
  //   return <Skelethon />;
  // }

  return (
    <Container>
      <NFTListContainer>
        {!isHome && <MarketMenu />}
        <NFTSettingContainer>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              NFT
            </Typography>
            <FormControl sx={{ m: 1 }} variant="standard" size="small">
              <Select
                value={orderMethod}
                onChange={handleOrder}
                input={<BootstrapInput />}
                sx={{
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              sx={{
                border: "1px solid #c6c6c6",
                borderRadius: ".75rem",
                color: "#f4f4f4",
              }}
              // toggle filter menu
              onClick={() => setOpenFilterMenu(!openFilterMenu)}
            >
              <TuneIcon
                sx={{
                  fontSize: "1rem",
                }}
              />
            </IconButton>
          </Box>
          <Box>
            <Searchbox
              value={keyword}
              onChange={handleSearch}
              className="search-nav"
              type="text"
            />
          </Box>
        </NFTSettingContainer>
        {/* <InfiniteScroll
        dataLength={activeListings.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={fetchData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        <Fragment>
          <Grid container spacing={2}>
          {openFilterMenu && <FilterComponent filterPage={"Market"} filterObject={filterObj} handleFilter={(obj) => handleFilter(obj)} />}
          {view !== 1 &&
              filteredSwapItems.length > 0 &&
              filteredSwapItems.map((item, index) => {
                return (
                  <Grid key={`index_${index}`} item xs={12} sm={6} md={view}>
                    <NFTListingCard listingItem={item} view={view} />
                  </Grid>
                );
              })}
          </Grid>
        </Fragment>
      </InfiniteScroll> */}
        <NFTContentContainer>
          {openFilterMenu && (
            <FilterComponent
              filterPage={"Swap"}
              filterObject={filterObj}
              handleFilter={(obj) => handleFilter(obj)}
            />
          )}
          {isLoading && (
            <SkeletonContainer>
              {[...Array(12)].map((e, i) => (
                <Box className="nft-card-link">
                  <Skeleton
                    className="mySkeleton"
                    variant="rounded"
                    key={i}
                    animation="wave"
                    style={{
                      borderRadius: "0.75rem",
                      marginBottom: "16px",
                      width: "100%",
                      height: "0",
                      paddingTop: "145%",
                    }}
                  />
                </Box>
              ))}
            </SkeletonContainer>
          )}
          {!isLoading && (
            <CollectionCardContainer>
              {view !== 1 &&
                filteredSwapItems.length > 0 &&
                filteredSwapItems.map((item, index) => {
                  return (
                    <NFTListingCard
                      listingItem={item}
                      view={view}
                      key={`index_${index}`}
                      where="swap"
                    />
                  );
                })}
            </CollectionCardContainer>
          )}
        </NFTContentContainer>
      </NFTListContainer>
    </Container>
  );
}

const NFTListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const NFTSettingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "center",
  color: "#f4f4f4",
  mb: 2,
  [theme.breakpoints.down(490)]: {
    flexDirection: "column",
  },
}));

const CollectionCardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
}));

const NFTContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "16px",
  [theme.breakpoints.down(992)]: {
    flexDirection: "column",
  },
}));

const SkeletonContainer = styled(Box)(({ theme }) => ({
  // display: "grid",
  // gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  // gap: "16px",
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
}));

export default Swap;
