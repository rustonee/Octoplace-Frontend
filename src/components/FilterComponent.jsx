/* eslint-disable no-unused-vars */
import {
  Box,
  Divider,
  Typography,
  TextField,
  Select,
  FormControl,
  MenuItem,
  Checkbox,
} from "@mui/material";
import React, {  useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FilterComponent({
  filterPage,
  unionTraits,
  filterParam,
  handleFilter,
}) {
  const myNFTs = useSelector((state) => state.myNFT.nfts);
  const categories = useSelector((state) => state.collection.collections);

  const [minPrice, setMinPrice] = useState(filterParam?.minPrice ?? 0);
  const [maxPrice, setMaxPrice] = useState(filterParam?.maxPrice ?? 0);
  const [blockchain, setBlockchain] = useState(
    filterParam?.blockchain ?? "empty"
  );
  const [collection, setCollection] = useState(
    filterParam?.collection ?? "empty"
  );
  const [selectedTraits, setSelectedTraits] = useState(filterParam?.traits);
  // const selectedTraits = filterParam?.traits;
  const [saleOnly, setSaleOnly] = useState(filterParam?.saleOnly ?? false);
  const [auctionOnly, setAuctionOnly] = useState(
    filterParam?.auctionOnly ?? false
  );
  const [offersReceived, setOffersReceived] = useState(
    filterParam?.offersReceived ?? 0
  );
  const [includeBurned, setIncludeBurned] = useState(
    filterParam?.includeBurned ?? 0
  );
  const marketItems = useSelector((state) => state.market.markets);
  const activeListings = useSelector((state) => state.listings.activeListings);

  let filterCollections = categories.filter((collection) =>
    myNFTs.some((nft) => nft.contractAddress === collection.contractAddress)
  );

  if (filterPage === "Market") {
    filterCollections = categories.filter((collection) =>
      marketItems.some(
        (nft) => nft.NFTContractAddress === collection.contractAddress
      )
    );
  } else if (filterPage === "Swap") {
    filterCollections = categories.filter((collection) =>
      activeListings.some(
        (nft) =>
          nft.listingNFT.contractAddress.toLowerCase() ===
          collection.contractAddress.toLowerCase()
      )
    );
  }

  const handleAttributeSelect = (traitType, value) => {
    let updatedTraits = [];
    // Check if the trait type is already selected
    const index = selectedTraits.findIndex((t) => t.trait_type === traitType);

    if (index !== -1) {
      // If it is, update the selected values for that trait type
      updatedTraits = [...selectedTraits]; //[...unionTraits];
      const traitIndex = updatedTraits.findIndex(
        (t) => t.trait_type === traitType
      );

      if (updatedTraits[traitIndex].value.includes(value.value)) {
        updatedTraits[traitIndex].value = updatedTraits[
          traitIndex
        ].value.filter((v) => v !== value.value);
        if (updatedTraits[traitIndex].value.length === 0) {
          updatedTraits = updatedTraits.filter(
            (element) => element.trait_type !== traitType
          );
        }
      } else {
        updatedTraits[traitIndex].value.push(value.value);
      }

      // setSelectedTraits(updatedTraits);
    } else {
      // If it isn't, add it to the selected traits array along with the selected value
      // setSelectedTraits([
      //   ...selectedTraits,
      //   { trait_type: traitType, value: [value.value] },
      // ]);
      updatedTraits = [
        ...selectedTraits,
        { trait_type: traitType, value: [value.value] },
      ];
    }

    // handleChange(updatedTraits);
    setSelectedTraits(updatedTraits);

    const filterObj = {
      minPrice: isNaN(minPrice) ? 0 : parseInt(minPrice, 10),
      maxPrice: isNaN(maxPrice) ? 0 : parseInt(maxPrice, 10),
      blockchain: blockchain,
      collection: collection,
      saleOnly: saleOnly,
      auctionOnly: auctionOnly,
      offersReceived: offersReceived,
      includeBurned: includeBurned,
      traits: updatedTraits,
    };

    handleFilter(filterObj);
  };

  const handleMaxPriceChange = (selMax) => {
    setMaxPrice(selMax);
    const filterObj = {
      minPrice: isNaN(minPrice) ? 0 : parseInt(minPrice, 10),
      maxPrice: isNaN(selMax) ? 0 : parseInt(selMax, 10),
      blockchain: blockchain,
      collection: collection,
      saleOnly: saleOnly,
      auctionOnly: auctionOnly,
      offersReceived: offersReceived,
      includeBurned: includeBurned,
      traits: selectedTraits,
    };

    handleFilter(filterObj);
  };

  const handleMinProceChange = (selMin) => {
    setMinPrice(selMin);
    const filterObj = {
      minPrice: isNaN(selMin) ? 0 : parseInt(selMin, 10),
      maxPrice: isNaN(maxPrice) ? 0 : parseInt(maxPrice, 10),
      blockchain: blockchain,
      collection: collection,
      saleOnly: saleOnly,
      auctionOnly: auctionOnly,
      offersReceived: offersReceived,
      includeBurned: includeBurned,
      traits: selectedTraits,
    };

    handleFilter(filterObj);
  };

  const handleChainChange = (selChain) => {
    setBlockchain(selChain);
    const filterObj = {
      minPrice: isNaN(minPrice) ? 0 : parseInt(minPrice, 10),
      maxPrice: isNaN(maxPrice) ? 0 : parseInt(maxPrice, 10),
      blockchain: selChain,
      collection: collection,
      saleOnly: saleOnly,
      auctionOnly: auctionOnly,
      offersReceived: offersReceived,
      includeBurned: includeBurned,
      traits: selectedTraits,
    };

    handleFilter(filterObj);
  };

  const handleCategoryChange = (selCollection) => {
    setCollection(selCollection);
    const filterObj = {
      minPrice: isNaN(minPrice) ? 0 : parseInt(minPrice, 10),
      maxPrice: isNaN(maxPrice) ? 0 : parseInt(maxPrice, 10),
      blockchain: blockchain,
      collection: selCollection,
      saleOnly: saleOnly,
      auctionOnly: auctionOnly,
      offersReceived: offersReceived,
      includeBurned: includeBurned,
      traits: selectedTraits,
    };

    handleFilter(filterObj);
  };

  if (filterPage === "Market") {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.column}>
          <Typography variant="h6">Price</Typography>
          <Box sx={styles.row}>
            <TextField
              type="number"
              variant="standard"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e) => handleMinProceChange(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  color: "#6C6C6C",
                  border: "1px solid #6C6C6C",
                  textAlign: "center",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Min",
              }}
            />
            <Typography variant="p">to</Typography>
            <TextField
              type="number"
              variant="standard"
              value={maxPrice === 0 ? "" : maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  color: "#6C6C6C",
                  border: "1px solid #6C6C6C",
                  textAlign: "center",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Max",
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Blockchain</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={blockchain}
              onChange={(e) => handleChainChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              <MenuItem value="theta">THETA</MenuItem>
              <MenuItem value="kava">KAVA</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Collection</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={collection}
              onChange={(e) => handleCategoryChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              {filterCollections.map((collection, index) => {
                return (
                  <MenuItem
                    key={`index_${index}`}
                    value={collection.contractAddress}
                  >
                    {collection.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

  if (filterPage === "Swap") {
    return (
      <Box sx={styles.container}>
        {/* <Box sx={styles.column}>
          <Typography variant="h6">Price</Typography>
          <Box sx={styles.row}>
            <TextField
              type="number"
              variant="standard"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e)=> setMinPrice(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  color: "#6C6C6C",
                  border: "1px solid #6C6C6C",
                  textAlign: "center",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Min",
              }}
            />
            <Typography variant="p">to</Typography>
            <TextField
              type="number"
              variant="standard"
              value={maxPrice === 0 ? "" : maxPrice}
              onChange={(e)=> setMaxPrice(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  color: "#262626!important",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  backgroundColor: "#F78C09",
                  border: "1px solid #262626",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Max",
              }}
            />
          </Box>
        </Box> */}
        <Box sx={styles.column}>
          <Typography variant="h6">Blockchain</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={blockchain}
              onChange={(e) => handleChainChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              <MenuItem value="theta">THETA</MenuItem>
              <MenuItem value="kava">KAVA</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Collection</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={collection}
              onChange={(e) => handleCategoryChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              {filterCollections.map((collection, index) => {
                return (
                  <MenuItem
                    key={`index_${index}`}
                    value={collection.contractAddress}
                  >
                    {collection.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

  if (filterPage === "Collection") {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.columnShort}>
          <Typography variant="h6">Status</Typography>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>For Sale Only</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}></Typography>
              <Checkbox
                sx={styles.checkbox}
                checked={saleOnly}
                onChange={(e) => setSaleOnly(e.target.checked)}
              />
            </Box>
          </Box>
          {/* <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Auction only</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={auctionOnly} onChange={(e) => setAuctionOnly(e.target.checked)}/>
            </Box>
          </Box>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Offers received</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={offersReceived} onChange={(e) => setOffersReceived(e.target.checked)}/>
            </Box>
          </Box>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Include Burned</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={includeBurned} onChange={(e) => setIncludeBurned(e.target.checked)}/>
            </Box>
          </Box> */}
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Price</Typography>
          <Box sx={styles.row}>
            <TextField
              type="number"
              variant="standard"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e) => handleMinProceChange(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  color: "#6C6C6C",
                  border: "1px solid #6C6C6C",
                  textAlign: "center",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Min",
              }}
            />
            <Typography variant="p">to</Typography>
            <TextField
              type="number"
              variant="standard"
              value={maxPrice === 0 ? "" : maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              hiddenLabel
              className="input-wo-padding"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#6c6c6c",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: "0",
                },
              }}
              InputProps={{
                style: {
                  color: "#6C6C6C",
                  border: "1px solid #6C6C6C",
                  textAlign: "center",
                  borderRadius: "0.594rem",
                  padding: "0.5rem",
                },
                disableUnderline: true,
                size: "small",
                placeholder: "Max",
              }}
            />
          </Box>
        </Box>
        <Divider />
        {unionTraits &&
          unionTraits.length > 0 &&
          unionTraits.map((item, index) => {
            return (
              <Accordion key={`index_${index}`} sx={styles.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#f4f4f4" }} />}
                  aria-controls="panel1a-content"
                  id={`panel1a-header-${index}`}
                  sx={styles.accordionHeader}
                >
                  <Typography sx={styles.attr}>{item.trait_type}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={styles.accordionBody}>
                  {!item.trait_type.toUpperCase().includes("RANK") &&
                    item.value &&
                    item.value.length > 0 &&
                    item.trait_type !== "Rank" &&
                    item.value.slice(0, 50).map((value, index) => {
                      return (
                        <Box key={`index_${index}`} sx={styles.checkboxRow}>
                          <Typography sx={styles.p}>
                            {typeof value.value === "object" &&
                            value.value !== null
                              ? value.value[0]
                              : value.value === "" || value.value === null
                              ? "None"
                              : value.value}
                          </Typography>
                          <Box sx={styles.boxRow}>
                            <Typography sx={styles.p}>
                              {value.count || ""}
                            </Typography>
                            <Checkbox
                              sx={styles.checkbox}
                              checked={selectedTraits.some(
                                (t) =>
                                  t.trait_type === item.trait_type &&
                                  t.value &&
                                  t.value.includes(value.value)
                              )}
                              onChange={() =>
                                handleAttributeSelect(item.trait_type, value)
                              }
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  {item.trait_type.toUpperCase().includes("RANK") &&
                    item.value &&
                    item.value.length > 0 && (
                      <Box sx={styles.row}>
                        <TextField
                          type="number"
                          variant="standard"
                          value={minPrice === 0 ? "" : minPrice}
                          onChange={(e) => handleMinProceChange(e.target.value)}
                          hiddenLabel
                          className="input-wo-padding"
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#6c6c6c",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "0",
                            },
                          }}
                          InputProps={{
                            style: {
                              color: "#6C6C6C",
                              border: "1px solid #6C6C6C",
                              textAlign: "center",
                              borderRadius: "0.594rem",
                              padding: "0.5rem",
                            },
                            disableUnderline: true,
                            size: "small",
                          }}
                          placeholder={`${Math.min(
                            ...item.value.map((item) => item.value)
                          )}`}
                        />
                        <Typography variant="p">to</Typography>
                        <TextField
                          type="number"
                          variant="standard"
                          value={maxPrice === 0 ? "" : maxPrice}
                          onChange={(e) => handleMaxPriceChange(e.target.value)}
                          hiddenLabel
                          className="input-wo-padding"
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#6c6c6c",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "0",
                            },
                          }}
                          InputProps={{
                            style: {
                              color: "#6C6C6C",
                              border: "1px solid #6C6C6C",
                              textAlign: "center",
                              borderRadius: "0.594rem",
                              padding: "0.5rem",
                            },
                            disableUnderline: true,
                            size: "small",
                          }}
                          placeholder={`${Math.max(
                            ...item.value.map((item) => item.value)
                          )}`}
                        />
                      </Box>
                    )}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>
    );
  }

  if (filterPage === "Dashboard") {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.columnShort}>
          <Typography variant="h6">Status</Typography>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>For Sale Only</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}></Typography>
              <Checkbox
                sx={styles.checkbox}
                checked={saleOnly}
                onChange={(e) => setSaleOnly(e.target.checked)}
              />
            </Box>
          </Box>
          {/* <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Auction only</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={auctionOnly} onChange={(e) => setAuctionOnly(e.target.checked)} />
            </Box>
          </Box>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Offers received</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={offersReceived} onChange={(e) => setOffersReceived(e.target.checked)} />
            </Box>
          </Box>
          <Box sx={styles.checkboxRow}>
            <Typography sx={styles.p}>Include Burned</Typography>
            <Box sx={styles.boxRow}>
              <Typography sx={styles.p}>23</Typography>
              <Checkbox sx={styles.checkbox} checked={includeBurned} onChange={(e) => setIncludeBurned(e.target.checked)} />
            </Box>
          </Box> */}
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Blockchain</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={blockchain}
              onChange={(e) => handleChainChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              <MenuItem value="theta">THETA</MenuItem>
              <MenuItem value="kava">KAVA</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />
        <Box sx={styles.column}>
          <Typography variant="h6">Collection</Typography>
          <FormControl
            sx={{
              width: "100%",
              color: "#f4f4f4",
              border: "1px solid #ced4da",
              borderRadius: ".5rem",
            }}
            size="small"
          >
            <Select
              value={collection}
              onChange={(e) => handleCategoryChange(e.target.value)}
              sx={{
                color: "#f4f4f4",
                fontSize: ".75rem",
                width: "100%",
                borderRadius: ".5rem",
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="empty">No Filter</MenuItem>
              {filterCollections.map((collection, index) => {
                return (
                  <MenuItem
                    key={`index_${index}`}
                    value={collection.contractAddress}
                  >
                    {collection.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }
}

const styles = {
  container: (theme) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1rem",
    // width: "300px",
    flex: "0 0 250px",
    maxWidth: "250px",
    height: "100%",
    padding: "1.5rem",
    backgroundColor: "#151515",
    color: "#f4f4f4",
    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: ".75rem",
    [theme.breakpoints.down(992)]: {
      maxWidth: "inherit",
      width: "100%",
    },
  }),
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1rem",
    width: "100%",
  },
  columnShort: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: ".1rem",
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ".5rem",
  },
  checkboxRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  boxRow: {
    display: "flex",
    paddingLeft: "10px",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: ".1rem",
  },
  checkbox: {
    color: "#6C6C6C",
    "&.Mui-checked": {
      color: "#F78C09",
    },
    // paddingLeft: "5px",
    // paddingRight: "0px",
    padding: "3px 0 3px 5px",
  },
  attr: {
    fontSize: "1.3rem",
    fontWeight: 400,
    margin: "0px",
  },
  p: {
    fontSize: ".9rem",
    fontWeight: 400,
    paddingLeft: "0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  accordion: {
    backgroundColor: "transparent",
    color: "#f4f4f4",
    border: "none",
    boxShadow: "none",
    width: "100%",
  },
  accordionHeader: {
    fontWeight: 400,
    fontsize: "1rem",
    px: 0,
  },
  accordionBody: {
    backgroundColor: "#151515",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    gap: 1,
  },
};

export default FilterComponent;
