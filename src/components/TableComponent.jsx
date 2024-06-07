import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import flameLogo from "../assets/flame.svg";

function TableComponent({ list }) {
  const listData = list.slice(0, 10);
  const [time, setTime] = useState(24);
  const windowWidth = window.innerWidth;

  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const truncate = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {}, [windowWidth]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "white",
        }}
      >
        <h3>Trending</h3>
        <FormControl
          sx={{
            m: 1,
            minWidth: 80,
            color: "#f4f4f4",
            border: "1px solid #ced4da",
            borderRadius: ".5rem",
          }}
          size="small"
        >
          <Select
            value={time}
            onChange={handleChange}
            sx={{
              color: "#f4f4f4",
              fontSize: ".75rem",
              borderRadius: ".5rem",
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={24}>Day</MenuItem>
            <MenuItem value={7}>Week</MenuItem>
            <MenuItem value={30}>Month</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Grid container spacing={5} sx={{ "& .no-spacing-sm": { gap: 0 } }}>
            <Grid item xs={12} sm={12} md={6}>
              <Box>
                {listData.slice(0, 5).map((item, index) => (
                  <Box
                    key={index + 1}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: ".5fr 1fr 1fr 1fr 1fr",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      py: ".5rem",
                      color: "#fff",
                    }}
                  >
                    <span>{index + 1}</span>
                    <img
                      src={item?.listingNFT?.metadata?.image}
                      alt={item?.listingNFT?.name}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <span>{truncate(item?.listingNFT?.name, 15)}</span>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img src={flameLogo} alt="flame" />
                      {item?.listingNFT?.tokenId}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img src={flameLogo} alt="flame" />
                      {item?.listingNFT?.tokenId}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box>
                {listData.slice(5, 10).map((item, index) => (
                  <Box
                    key={index + 6}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: ".5fr 1fr 1fr 1fr 1fr", // Adjust the column sizes here
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      py: ".5rem",
                      color: "#fff",
                    }}
                  >
                    <span>{index + 6}</span>
                    <img
                      src={item?.listingNFT?.metadata?.image}
                      alt={item?.listingNFT?.name}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <span>{truncate(item?.listingNFT?.name, 15)}</span>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img src={flameLogo} alt="flame" />
                      {item?.listingNFT?.tokenId}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <img src={flameLogo} alt="flame" />
                      {item?.listingNFT?.tokenId}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default TableComponent;
