import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container, Row, Col } from "react-bootstrap";
import infoIcon from "../assets/Infrormation_button.svg";
import nextIcon from "../assets/next.svg";
import prevIcon from "../assets/prev.svg";
import { Paper, Button, Grid, Box, useMediaQuery, Fab } from "@mui/material";

import { NFTListingCard } from "../pages/listings/components/ListingCard";
import MediaCard from "./MediaCard";
import { useDispatch, useSelector } from "react-redux";
import { setActiveListings } from "../redux/slices/listing-slice";
import { getActiveListings } from "../utils/format-listings";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Autoplay, EffectFlip, FreeMode, Navigation } from "swiper";

import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
import "swiper/modules/grid/grid.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

function RowSlider({ title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = window.innerWidth;
  const isXSmallScreen = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery(
    "(min-width: 601px) and (max-width: 900px)"
  );
  const isMediumScreen = useMediaQuery(
    "(min-width: 901px) and (max-width: 1200px)"
  );
  const isLargeScreen = useMediaQuery(
    "(min-width: 1201px) and (max-width: 1535px)"
  );
  const isXLargeScreen = useMediaQuery("(min-width: 1536px)");
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.allListings);
  const activeListings = useSelector((state) => state.listings.activeListings);
  const [view, setView] = useState(3);
  const [orderMethod, setOrderMethod] = useState("Price: Low to High");

  let numItemsToShow = 3;

  if (isXSmallScreen) {
    numItemsToShow = 1;
  } else if (isSmallScreen) {
    numItemsToShow = 2;
  } else if (isLargeScreen) {
    numItemsToShow = 4;
  } else if (isXLargeScreen) {
    numItemsToShow = 6;
  }

  const handlePrevClick = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const handleNextClick = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= activeListings.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (listings.length > 0) {
      const active = getActiveListings(listings);
      dispatch(setActiveListings(active));
    }
  }, [listings]);

  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Container>
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
            {title}
          </h3>
          <Tooltip
            title="Most popular collections by the total number of comments"
            placement="right"
          >
            <img src={infoIcon} alt="" width={16} height={16} />
          </Tooltip>
        </Box>
      </Container>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          minHeight: "320px",
          position: "relative",
        }}
      >
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            370: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 5,
            },
            1536: {
              slidesPerView: 6,
            },
          }}
          freeMode={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".prevBtn",
            nextEl: ".nextBtn",
          }}
          modules={[FreeMode, Navigation, Autoplay, EffectFlip]}
        >
          {activeListings.map((item, i) => {
            return (
              <SwiperSlide key={`index_${i}`}>
                <NFTListingCard listingItem={item} view={3} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="nextIcon nextBtn">
          <Fab aria-label="next" color="default" size="small">
            <NavigateNext />
          </Fab>
        </div>
        <div className="prevIcon prevBtn">
          <Fab aria-label="prev" color="default" size="small">
            <NavigateBefore />
          </Fab>
        </div>
      </Container>
    </Box>
  );
}

export default RowSlider;
