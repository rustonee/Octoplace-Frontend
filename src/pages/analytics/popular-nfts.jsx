/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container } from "react-bootstrap";
import infoIcon from "../../assets/Infrormation_button.svg";
import { Box, Fab } from "@mui/material";
import { NFTCard } from "../collections/components/nft-card";
// import { NFTListingCard } from "../../pages/listings/components/ListingCard";
import { useDispatch, useSelector } from "react-redux";
// import { setActiveListings } from "../../redux/slices/listing-slice";
// import { getActiveListings } from "../../utils/format-listings";
import { getPopularNFTs } from "../../redux/thunk/get-analytics";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import { Autoplay, EffectFlip, FreeMode, Navigation } from "swiper";

import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
import "swiper/modules/grid/grid.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

export function PopularNFTs({ title }) {
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const windowWidth = window.innerWidth;
  // const isXSmallScreen = useMediaQuery("(max-width: 600px)");
  // const isSmallScreen = useMediaQuery(
  //   "(min-width: 601px) and (max-width: 900px)"
  // );
  // const isMediumScreen = useMediaQuery(
  //   "(min-width: 901px) and (max-width: 1200px)"
  // );
  // const isLargeScreen = useMediaQuery(
  //   "(min-width: 1201px) and (max-width: 1535px)"
  // );
  // const isXLargeScreen = useMediaQuery("(min-width: 1536px)");

  const dispatch = useDispatch();
  const popularNFTs = useSelector((state) => state.analytics.popularNFTs);

  // let numItemsToShow = 3;

  // if (isXSmallScreen) {
  //   numItemsToShow = 1;
  // } else if (isSmallScreen) {
  //   numItemsToShow = 2;
  // } else if (isLargeScreen) {
  //   numItemsToShow = 4;
  // } else if (isXLargeScreen) {
  //   numItemsToShow = 6;
  // }

  // const handlePrevClick = () => {
  //   setCurrentIndex(Math.max(currentIndex - 1, 0));
  // };

  // const handleNextClick = () => {
  //   const nextIndex = currentIndex + 1;
  //   if (
  //     nextIndex >=
  //     popularNFTs.length - (numItemsToShow == 1 ? 1 : numItemsToShow - 1)
  //   ) {
  //     setCurrentIndex(0);
  //   } else {
  //     setCurrentIndex(nextIndex);
  //   }
  // };

  useEffect(() => {
    dispatch(getPopularNFTs());
  }, []);

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
            title="Most popular NFTs by the total number of comments"
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
          alignItems: "flex-start",
          gap: 10,
          minHeight: "300px",
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
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          freeMode={true}
          navigation={{
            prevEl: ".navPrev",
            nextEl: ".navNext",
          }}
          modules={[FreeMode, Navigation, Autoplay, EffectFlip]}
        >
          {popularNFTs.map((item, i) => {
            let obj = { ...item, network: item.Network };
            return (
              <SwiperSlide key={`index_${i}`}>
                <NFTCard nft={obj} view={3} isSwiper={true} where="/popular" />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="nextIcon navNext">
          <Fab aria-label="next" color="default" size="small" sx={{ mb: 5 }}>
            <NavigateNext />
          </Fab>
        </div>
        <div className="prevIcon navPrev">
          <Fab aria-label="prev" color="default" size="small" sx={{ mb: 5 }}>
            <NavigateBefore />
          </Fab>
        </div>
      </Container>
    </Box>
  );
}
