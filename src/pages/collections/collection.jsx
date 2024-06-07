/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
// import { useDispatch } from "react-redux";

import infoIcon from "../../assets/Infrormation_button.svg";

import CardList from "../../components/CardList";
// import RowSlider from "../../components/RowSlider";
import CarouselCollection from "../../components/CarouselCollection";
import Searchbox from "../../components/searchbox";
import { getCollections } from "../../redux/thunk/getAllCollections";
import { styled } from "@mui/system";
import { PopularCollections } from "../analytics/popular-collections";

export const CollectionsPage = () => {
  // const dispatch = useDispatch();
  // const collections = useSelector((state) => {
  //   console.log(state.collection.collections.slice(0,49));
  //   return state.collection.collections.slice(0,49)
  // });

  // const collections = useSelector((state) => state.collection.collections);
  const [view, setView] = useState(2);
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [totalCounts, setTotalCounts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    const response = await getCollections({
      page: page,
      limit: 24,
      name: search,
      visible: 1,
    });

    const newItems = response.collections;
    // const uniqueNewItems = newItems.filter(
    //   (newItem) => !collections.some((item) => item.id === newItem.id)
    // );
    // console.log("/////////////////////// ", uniqueNewItems)
    const newTotalCounts = response.totalCounts;
    setCollections([...collections, ...newItems]);

    setTotalCounts(newTotalCounts);
    if (collections.length >= newTotalCounts) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }

    setLoading(false);
  };

  const handleSearch = (event) => {
    setLoading(true);
    setCollections([]);
    setPage(0);
    setSearch(event.target.value);
  };

  useEffect(() => {
    setCollections([]);
    setPage(0);
    setTotalCounts(0);
    setHasMore(true);
    fetchCollections();
  }, [search]);

  return (
    <Box>
      <CarouselCollection />
      {/* <RowSlider title="Popular Collections" /> */}
      <PopularCollections title="Popular Collections" />
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#f4f4f4",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <h3
              style={{
                color: "#f4f4f4",
                margin: 0,
              }}
            >
              Collections
            </h3>
            <Tooltip
              title={`Found a total of ${totalCounts} collections.`}
              placement="right"
            >
              <img src={infoIcon} alt="" width={16} height={16} />
            </Tooltip>
          </Box>
          <Box>
            <Searchbox
              value={search}
              onChange={handleSearch}
              className="search-nav"
              type="text"
            />
          </Box>
        </Box>
        {/* {loading && (
          <SkeletonContainer>
            {[...Array(12)].map((e, i) => (
              <Skeleton variant="rounded" width={"100%"} height={270} key={i} />
            ))}
          </SkeletonContainer>
        )} */}
        {/* {!loading && collections && ( */}
        <InfiniteScroll
          dataLength={collections.length}
          next={fetchCollections}
          hasMore={hasMore}
          // loader={<h4>Loading...</h4>}
          style={{
            width: "100%",
            // marginLeft: "calc(-.25 * var(--bs-gutter-x))",
            // marginRight: "calc(-.25 * var(--bs-gutter-x))",
          }}
        >
          <CardList list={collections} view={view} />
          {loading && (
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
          {!loading && collections.length === 0 && (
            <Typography
              sx={{
                m: 8,
                fontSize: "1.8em",
                color: "#f4f4f4",
                textAlign: "center",
              }}
            >
              NO COLLECTIONS FOUND
            </Typography>
          )}
        </InfiniteScroll>
        {/* )} */}
        {/* {!loading && collections.length === 0 && (
          <Typography
            sx={{
              m: 8,
              fontSize: "1.8em",
              color: "#f4f4f4",
              textAlign: "center",
            }}
          >
            NO COLLECTIONS FOUND
          </Typography>
        )} */}
      </Container>
    </Box>
  );
};

const SkeletonContainer = styled(Box)(({ theme }) => ({
  // display: "grid",
  // gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  // gap: "16px",
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
}));
