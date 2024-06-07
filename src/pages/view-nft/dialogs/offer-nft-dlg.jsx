/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Typography,
  Box,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Grid,
  Tooltip,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import { NFTMarketCard } from "../components/nft-market-card";
import { styled } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import TuneIcon from "@mui/icons-material/Tune";
import FilterComponent from "../../../components/FilterComponent";
import Searchbox from "../../../components/searchbox";
import { useSelector } from "react-redux";
import { filterListedNFTs } from "../../../utils/filter";
// import { getImageUrl } from "../../../utils/string-util";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatOffers } from "../../../utils/format-listings";
import { getNetworkInfo } from "../../../connectors/networks";
import axios from "axios";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

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
    "& .MuiSelect-icon": {
      color: "white",
    },
  },
}));

export const OfferNFTDialog = (props) => {
  const { onClose, open, listingId, network } = props;
  const sendDataToGTM = useGTMDispatch();
  const loading = useSelector((state) => state.myNFT.isLoading);
  const originalMyNFTs = useSelector((state) => state.myNFT.nfts);
  const listings = useSelector((state) => state.listings.allListings);
  const handleClose = () => {
    onClose();
  };
  const navigate = useNavigate();
  const [view, setView] = useState(2);

  const [orderMethod, setOrderMethod] = useState("Price: Low to High");
  const handleChange = (event) => {
    setOrderMethod(event.target.value);
  };

  // const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [selectedNftOffer, setSelectedNftOffer] = useState();
  const [myNFTs, setMyNFTs] = useState([]);

  // const handleListItemClick = (event, index, item) => {
  //   setSelectedIndex(index);
  //   setSelectedNftOffer(item);
  // };

  const handleListItemClick = (item) => {
    if (selectedNftOffer !== item) {
      sendDataToGTM({
        event: "Viewed Pick NFT Popup (Swap)",
        customData: {
          "Collection Address": item.contractAddress,
          "token Id": item.tokenId,
        },
      });
      setSelectedNftOffer(item);
    } else {
      setSelectedNftOffer();
    }
  };

  const [openFilterMenu, setOpenFilterMenu] = useState(false);

  const [keyword, setKeyword] = useState("");
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

  const createData = async () => {
    const netInfo = getNetworkInfo(network);
    const provider = new JsonRpcProvider(netInfo.dataNetwork.RPC);
    const contract = new Contract(
      netInfo.dataNetwork.SWAP_CONTRACT,
      netInfo.dataNetwork.SWAP_ABI,
      provider
    );

    let offers = await contract.readAllOffers();
    offers = formatOffers(offers, network);

    offers = offers.filter((x) => //this filters declined offers
      x.isDeclined === false &&
      x.isCancelled === false &&
      x.isCompleted === false
    );
    console.log('offers', offers);

    let filteredOriginalMyNFTs = filterListedNFTs(
      originalMyNFTs.filter((x) => x.network === network),
      listings,
      offers
    );
    console.log('filteredOriginalMyNFTs', filteredOriginalMyNFTs);

    let nftArr = [];
    for (var nftItem of filteredOriginalMyNFTs) {
      if (nftItem.url) {
        try {
          const meta = await getMetadata(nftItem.url);
          nftArr = [...nftArr, { ...nftItem, metadata: meta }];
        } catch (error) {
          console.log("error while fetch nft", error);
        }
      } else {
        nftArr = [...nftArr, nftItem];
      }
    }
    setMyNFTs(nftArr);
  };

  useEffect(() => {
    if (originalMyNFTs.length > 0 && listings.length > 0) {
      createData();
    }
  }, [originalMyNFTs, listings]);

  const getMetadata = async (url) => {
    const metadataResult = await axios.get(url);
    return metadataResult.data;
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const handleFilter = (filterObj) => {
    setFilterObj(filterObj);
  };

  const filteredMyNFTs = myNFTs.filter((item) => {
    if (!item.metadata) {
      return false;
    }

    if (
      item.metadata &&
      item.metadata.name &&
      !item.metadata.name.toLowerCase().includes(keyword.toLowerCase())
    ) {
      return false;
    }

    if (
      filterObj.minPrice !== 0 &&
      parseInt(item.Price, 10) < filterObj.minPrice
    ) {
      return false;
    }

    if (
      filterObj.maxPrice !== 0 &&
      parseInt(item.Price, 10) > filterObj.maxPrice
    ) {
      return false;
    }

    if (
      filterObj.blockchain !== "empty" &&
      item.network.toLowerCase() !== filterObj.blockchain
    ) {
      return false;
    }

    if (
      filterObj.collection !== "empty" &&
      item.contractAddress !== filterObj.collection
    ) {
      return false;
    }

    return true;
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} className="nft-list-dlg">
      <DialogTitle className="title">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography sx={{ ml: "8px" }} variant="h5">
            Pick NFT
          </Typography>
          <span className="spacer"></span>
          <IconButton onClick={handleClose}>
            <Close className="icon" />
          </IconButton>
        </Box>
      </DialogTitle>
      {/* <Divider /> */}
      <DialogContent sx={{ maxHeight: "60vh" }}>
        {/* {!loading && <Typography>Select your NFT for swap.</Typography>} */}
        {loading && (
          <Box>
            <Box sx={style.progress}>
              <CircularProgress>Loading your NFTs</CircularProgress>
            </Box>
            <Box sx={style.progress}>
              <Typography variant="caption">Loading your NFTs</Typography>
            </Box>
          </Box>
        )}
        {/* <List component="nav">
          {myNFT.map( (item, index) => {
            let obj;
            try {
              if (!item.metadata && !item.url) {
                const meta = {
                  name: item.collectionName,
                  image:
                    "data:image/png;base64,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",
                };

                obj = {
                  metadata: meta,
                  tokenId: item.tokenId,
                  collectionName: item.collectionName,
                };
              } else if (!item.metadata && item.url) {
                
                const meta = getMetadata(item.url);
                obj = {
                  metadata: meta,
                  tokenId: item.tokenId,
                  collectionName: meta.name,
                };
              } else {
                obj = item;
              }
            } catch {
              const meta = {
                name: item.collectionName,
                image:
                  "data:image/png;base64,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",
              };
              obj = {
                metadata: meta,
                tokenId: item.tokenId,
                collectionName: item.collectionName,
              };
            }
            return (
              <ListItemButton
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index, obj)}
                key={`${index}_${obj.name}`}
              >
                <ListItemIcon>
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={manageUrl(obj.metadata)}
                    alt={obj.metadata.name}
                  />
                </ListItemIcon>
                {obj.metadata && (
                  <ListItemText
                    primary={
                      obj.metadata && obj.metadata.name
                        ? obj.metadata.name
                        : `${obj.collectionName} #${obj.tokenId}`
                    }
                  />
                )}
              </ListItemButton>
            );
          })}
        </List> */}
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
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ ml: "8px" }} variant="h5">
              NFT
            </Typography>
            <FormControl sx={{ m: 1 }} variant="standard" size="small">
              <Select
                value={orderMethod}
                onChange={handleChange}
                input={<BootstrapInput />}
                sx={{
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="Price: High to Low">High to Low</MenuItem>
                <MenuItem value="Price: Low to High">Low to High</MenuItem>
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
        </Box>
        <Fragment>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            {openFilterMenu && (
              <FilterComponent
                filterPage={"Market"}
                filterParam={filterObj}
                handleFilter={(obj) => handleFilter(obj)}
              />
            )}
            <Grid container spacing={2}>
              {view !== 1 &&
                !loading &&
                filteredMyNFTs.length > 0 &&
                filteredMyNFTs.map((item, index) => {
                  return (
                    <Grid
                      key={`index_${index}`}
                      item
                      xs={12}
                      sm={6}
                      md={view}
                      sx={{
                        my: 2,
                      }}
                      onClick={() => handleListItemClick(item)}
                    >
                      <NFTMarketCard
                        marketItem={item}
                        view={view}
                        selected={
                          selectedNftOffer &&
                          selectedNftOffer.contractAddress ===
                          item.contractAddress &&
                          Number(selectedNftOffer.tokenId) ===
                          Number(item.tokenId)
                        }
                      />
                    </Grid>
                  );
                })}
              {view !== 1 && !loading && filteredMyNFTs.length === 0 && (
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "200px",
                  }}
                >
                  <Typography style={{ width: "100%" }}>
                    It seems that you don’t have any NFT on{" "}
                    {network.toUpperCase()}.
                    <br />
                    You can find and get NFT{" "}
                    <a
                      href={
                        network.toLowerCase() === "theta"
                          ? "https://www.thetadrop.com/"
                          : "https://www.kava.io/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    .
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>
        </Fragment>
      </DialogContent>
      <DialogActions sx={style.dlgActions}>
        <Tooltip
          title={
            selectedNftOffer === undefined && (
              <Typography fontSize={"0.83rem"}>
                You must select and NFT to offer a swap.
              </Typography>
            )
          }
        >
          <span style={{ fontSize: "smaller" }}>
            <Button
              disabled={loading || myNFTs.length === 0 || selectedNftOffer === undefined}
              sx={style.orangeButton}
              style={{ color: myNFTs.length === 0 || selectedNftOffer === undefined ? "gray" : "#262626" }}
              onClick={() => {
                //console.log('selectedNftOffer',selectedNftOffer)
                sendDataToGTM({
                  event: "Viewed Swap Offer page",
                  customData: {
                    "listing Id": listingId,
                    "Collection Address": selectedNftOffer.contractAddress,
                    "token Id": selectedNftOffer.tokenId,
                  },
                });

                onClose();
                navigate(
                  `/swap/initiate-offer/${network}/${listingId}/${selectedNftOffer.contractAddress}/${selectedNftOffer.tokenId}`
                );
              }}
              variant="contained"
            >
              SAVE
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

const style = {
  img: {
    width: "50px",
    height: "auto",
  },
  dlgActions: {
    // paddingRight: "24px",
    direction: "column",
    paddingBottom: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  orangeButton: {
    backgroundColor: "#F78C09",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: ".625rem",
    color: "#262626",
    fontSize: "1rem",
    fontWeight: 600,
    width: 300,
    mb: 2,
  },
  paper: {
    padding: "5px",
    marginTop: "16px",
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "top",
  },
  progress: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
};

// function manageUrl(metadata) {
//   try {
//     if (metadata && metadata.image) {
//       return getImageUrl(metadata.image);
//     }
//   } catch {
//     return "";
//   }
// }
