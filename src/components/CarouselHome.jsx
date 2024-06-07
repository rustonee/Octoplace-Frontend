/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/bg.png";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

function Item(props) {
  const sendDataToGTM = useGTMDispatch();

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
      sendDataToGTM({
        event: "Opened Home Banner",
        customData: { url: url },
      });

      window.open(url, "_blank");
    }
  };

  return (
    <CarouselPaper
      className="home-banner"
      image={props.item.bannerImage}
      onClick={() => handleImageClick(props.item.url, "_blank")}
    >
      {/* <h2>{props.item.name}</h2>
      <p>{props.item.url}</p>
      <Button className="CheckButton">Check it out!</Button> */}
    </CarouselPaper>
  );
}

const CarouselPaper = styled(Paper)(({ theme, image }) => ({
  backgroundImage: `url(${process.env.REACT_APP_API_URL}/assets/banners/${image})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  padding: "2rem",
  cursor: "grab",
  width: "100%",
  height: "450px",
  [theme.breakpoints.down(1120)]: {
    height: "360px",
  },
  [theme.breakpoints.down(768)]: {
    height: "280px",
  },
  [theme.breakpoints.down(540)]: {
    height: "220px",
  },
}));

function CarouselHome() {
  const [items, setItems] = useState([]);

  const defaultItems = [
    {
      name: "Random Name #1",
      url: "",
      image: backgroundImage,
    },
    {
      name: "Random Name #2",
      url: "",
      image: backgroundImage,
    },
    {
      name: "Random Name #3",
      url: "",
      image: backgroundImage,
    },
  ];

  const downloadBanners = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(apiUrl + "/banners/home/lists");

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
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}

export default CarouselHome;
