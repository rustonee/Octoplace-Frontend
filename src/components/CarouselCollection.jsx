/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/bg.png";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { Container } from "react-bootstrap";

function CarouselCollection() {
  const [items, setItems] = useState([]);

  const defaultItems = [
    {
      name: "Banner1",
      url: "",
      image: backgroundImage,
    },
    {
      name: "Banner2",
      url: "",
      image: backgroundImage,
    },
    {
      name: "Banner3",
      url: "",
      image: backgroundImage,
    },
  ];

  const downloadBanners = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(apiUrl + "/banners/collection/lists");

      if (response.ok) {
        let bannerInfos = await response.json();
        bannerInfos = bannerInfos.filter((item) => item.bannerImage);
        setItems(bannerInfos);
      } else {
        console.error("Failed to get banner file");
        setItems(defaultItems);
      }
    } catch (error) {
      console.error("Error downloading banner file:", error);
      setItems(defaultItems);
    }
  };

  useEffect(() => {
    downloadBanners();
  }, []);

  const styles = {
    container: {
      // position: "relative",
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    image: {
      width: "150px",
      height: "150px",
    },
    whiteButton: {
      backgroundColor: "#f4f4f4",
      color: "#262626",
      textTransform: "none",
      fontWeight: 700,
      fontSize: "1rem",
      "&:hover": {
        backgroundColor: "#f4f4f4",
        color: "#262626",
        cursor: "pointer",
      },
    },
    // bgImage: {
    //   backgroundImage: `url(${props.item.image})`,
    //   backgroundPosition: "center",
    //   backgroundSize: "cover",
    //   backgroundRepeat: "no-repeat",
    //   padding: "2rem",
    //   height: "50vh",
    // },
  };

  function isUrl(str) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return pattern.test(str);
  }

  const handleImageClick = (url) => {
    if (isUrl(url)) {
      window.open(url, "_blank");
    }
  };

  return (
    <Carousel
      autoPlay={true}
      stopAutoPlayOnHover={true}
      swipe={true}
      duration={1000}
      animation="fade"
      cycleNavigation={true}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#F78C09",
        },
      }}
      indicatorContainerProps={{
        style: {
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
          margin: "2rem 0",
        },
      }}
    >
      {items.map((item, index) => (
        <Box key={`index_${index}`}>
          <CarouselBanner
            style={{
              backgroundImage: `url(${process.env.REACT_APP_API_URL}/assets/banners/${item.bannerImage})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <OverlayContainer>
                <Box sx={styles.imageContainer}>
                  <Img
                    src={`${process.env.REACT_APP_API_URL}/assets/banners/${item.avatarImage}`}
                    alt="profileImage"
                    // sx={styles.image}
                    className="octagon-image"
                  />
                  <ThetaTitle>{item?.title}</ThetaTitle>
                </Box>
                <ViewCollectionButton
                  variant="contained"
                  onClick={() => handleImageClick(item.url, "_blank")}
                >
                  View Collection
                </ViewCollectionButton>
              </OverlayContainer>
            </Box>
          </CarouselBanner>
        </Box>
      ))}
    </Carousel>
  );
}

const CarouselBanner = styled(Paper)(({ theme }) => ({
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  cursor: "grab",
  height: "450px",
  // [theme.breakpoints.down(1120)]: {
  //   height: "360px",
  // },
  // [theme.breakpoints.down(768)]: {
  //   height: "280px",
  // },
  // [theme.breakpoints.down(540)]: {
  //   height: "220px",
  // },
  [theme.breakpoints.down(480)]: {
    padding: "1rem",
  },
}));

const Img = styled("img")(({ theme }) => ({
  width: "180px",
  height: "180px",
  [theme.breakpoints.down(640)]: {
    width: "120px",
    height: "120px",
  },
}));

const OverlayContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  zIndex: 3,
  height: "434px",
  // [theme.breakpoints.down(1120)]: {
  //   height: "344px",
  // },
  // [theme.breakpoints.down(768)]: {
  //   height: "264px",
  // },
  // [theme.breakpoints.down(540)]: {
  //   height: "204px",
  // },
  [theme.breakpoints.down(480)]: {
    height: "404px",
  },
  [theme.breakpoints.down(450)]: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: "16px",
  },
}));

const ThetaTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "2.5rem",
  lineHeight: "3rem",
  color: "#F4F4F4",
  WebkitTextStroke: "1.5px black",
  WebkitTextFillColor: "white",
  [theme.breakpoints.down(640)]: {
    fontSize: "2rem",
    lineHeight: "1.5rem",
    WebkitTextStroke: "1px black",
  },
}));

const ViewCollectionButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f4f4f4",
  color: "#262626",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#f4f4f4",
    color: "#262626",
    cursor: "pointer",
  },
}));

export default CarouselCollection;
