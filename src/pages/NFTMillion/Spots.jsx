/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Tooltip } from "@mui/material";
import mappedImages from "../../constants/mappedImages.json";
import { SPACE_WIDTH } from "../../constants/nftMillions";
import { useGlobalState } from "../../hook/globalState";
import TransparentPng from "../../assets/transparent.png";
import { styled } from "@mui/system";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

const customStyle = {
  cell: {
    position: "absolute",
    transition: "0.2s transform",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.2)",
      zIndex: "100000",
    },
  },
  hl: {
    boxShadow: "0 0 4px 2px rgba(0, 0, 0, 0.5)",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  mini: {
    "&:hover": {
      transform: "scale(1.6)",
    },
  },
  noimage: {
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
};

export default React.memo(function Spots(props) {
  const { spots, editIndex, editLinkUrl, editTitle, editImageUrl } = props;

  const sendDataToGTM = useGTMDispatch();

  const [shownSpots, setShownSpots] = useGlobalState("shownSpots");

  useEffect(() => {
    if (shownSpots >= spots.length) {
      return;
    }
    const timer = setTimeout(() => {
      setShownSpots(shownSpots + 5);
    }, 50);
    return () => clearTimeout(timer);
  }, [shownSpots, spots.length]);

  return (
    <>
      {spots.slice(0, shownSpots).map((e, i) => {
        let href = editIndex === e._index ? editLinkUrl : e.link;
        if (href === "https://") {
          href = "";
        }
        const title = (editIndex === e._index ? editTitle : e.title).trim();

        let tooltipText = "";
        if (href !== "" || title !== "") {
          let tooltipTitle =
            title === "" ? null : (
              <>
                {title}
                <br />
              </>
            );
          let hrefToShow = href;
          if (hrefToShow.length > 80) {
            hrefToShow = hrefToShow.slice(0, 80) + "...";
          }
          let tooltipLink =
            href === "" ? <em>(no link)</em> : <span>{hrefToShow}</span>;
          tooltipText = (
            <>
              {tooltipTitle}
              {tooltipLink}
            </>
          );
        }
        let styles = [customStyle.cell];
        if (editIndex === e._index) {
          styles.concat(customStyle.hl);
        }
        if (e.width === 1 && e.height === 1) {
          styles.concat(customStyle.mini);
        }

        let src = e.image;
        if (editIndex === e._index) {
          src = editImageUrl;
        } else {
          // mappedImages example -> Array<['https://...super-big-image.jpg', '1.jpg'] (contains "original" -> minified version)
          // the mapped image is only used if the image in [0] is the image that is actually given
          // so in case the image is changed later, we won't use our version
          const mappedImage = mappedImages[e._index];
          if (mappedImage && mappedImage[0] === src) {
            src = require(`../../assets/spots/${mappedImage[1]}`).default;
          }
        }
        if (src === "https://" || src === "") {
          src = TransparentPng;
          styles.concat(customStyle.noimage);
        }
        let element = "span";
        const props = {
          // className: classNames.join(' '),
          style: {
            left: `${e.x * SPACE_WIDTH}px`,
            top: `${e.y * SPACE_WIDTH}px`,
            width: `${e.width * SPACE_WIDTH}px`,
            height: `${e.height * SPACE_WIDTH}px`,
            backgroundColor: "#" + e.owner.slice(-6),
          },
          "data-tokenid": e._index,
        };
        if (href) {
          element = "a";
          props.href = href;
          props.target = "_blank";
        }

        const combineStyle = { ...styles[0], ...props.style };

        return (
          <ALink
            href={props.href}
            target={props.target}
            key={props["data-tokenid"]}
            onClick={() =>
              sendDataToGTM({
                event: "Opened One Million NFT",
                customData: `spot: ${props.href}`,
              })
            }
          >
            <Tooltip
              key={props["data-tokenid"]}
              componentsProps={props}
              title={tooltipText}
            >
              <img src={src} alt="" style={combineStyle} loading="lazy" />
            </Tooltip>
          </ALink>
        );
      })}
    </>
  );
});

const ALink = styled("a")(({ theme }) => ({
  img: {
    "&:hover": {
      transform: "scale(1.2)",
      zIndex: "1000",
    },
  },
}));
