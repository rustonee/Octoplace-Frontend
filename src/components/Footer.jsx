/* eslint-disable no-unused-vars */
import { Box, Divider, IconButton, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import { Fragment } from "react";
import {  Col } from "react-bootstrap";
import { FaDiscord } from "react-icons/fa";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export const Footer = () => {
  const navigate = useNavigate();
  const contactEmail = "contact@octoplace.io";

  const styles = {
    nav: {
      backgroundColor: "black",
      position: "relative",
      bottom: 0,
      width: "100%",
      marginTop: "16px",
      zIndex: 10,
    },
    row: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 1,
      color: "white",
      width: "100%",
      fontSize: "1rem",
      textWrap: "nowrap",
    },
    legal: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 3,
      color: "#6C6C6C",
      mt: ".75rem",
      mb: ".75rem",
      width: "100%",
      fontSize: ".75rem",
      cursor: "pointer",
    },
    legalTextContainer: (theme) => ({
      display: "flex",
      alignItems: "center",
      gap: "24px",
      [theme.breakpoints.down(840)]: {
        display: "none",
      },
    }),
    legalText: {
      textWrap: "nowrap",
      "&:hover": {
        color: "#F4F4F4",
      },
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    icon: {
      color: "#fff",
      "&:hover": {
        color: "#F78C09",
      },
    },
  };
  return (
    <Fragment>
      <nav style={styles.nav}>
        <ContainerWrapper>
          <FooterLinkContainer>
            <FooterExplain>
              <Box style={{ width: "100%", textAlign: "center" }}>
                <Typography variant="h2" style={{ color: "#f4f4f4" }}>
                  OCTO
                </Typography>
                <FooterLogo
                  src={Logo}
                  alt="kingpad-footer-logo"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo(0, 0);
                  }}
                />
              </Box>

              <ExplainContent>
                More features, More chains, Less fees, One place.
              </ExplainContent>
              <ExplainContent1 style={{ fontSize: "14px" }}>
                OCTO is super dApp that resolves around Non-Fungible
                Tokens(NFTs) with a string emphasis on creators and communities.
                Most comprehensive functionality with built-in social tools,
                while being chain-agnostic, as Web3 should be. Join us today!
              </ExplainContent1>
            </FooterExplain>
            <FooterLinks>
              <FooterLink>
                <FooterLinkTitle>KNOWLEDGE BASE</FooterLinkTitle>
                <FooterLinkNavs>
                  <FooterLinkNav>Guide</FooterLinkNav>
                  <FooterLink link="">
                    <FooterLinkNav>What are NFTs?</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>How to buy NFTs?</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Sequrity questions</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>FAQ</FooterLinkNav>
                  </FooterLink>
                </FooterLinkNavs>
              </FooterLink>
              <FooterLink>
                <FooterLinkTitle>DISCOVER</FooterLinkTitle>
                <FooterLinkNavs>
                  <FooterLink link="">
                    <FooterLinkNav>Log in</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Trade</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Swap</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Popular collections</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Popular NFTs</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Discussion boards</FooterLinkNav>
                  </FooterLink>
                </FooterLinkNavs>
              </FooterLink>
              <FooterLink>
                <FooterLinkTitle>COMMUNITY</FooterLinkTitle>
                <FooterLinkNavs>
                  <FooterLink link="">
                    <FooterLinkNav>Discord</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="https://discord.gg/73Ru5XUP2X">
                    <FooterLinkNav>X(Twitter)</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="https://twitter.com/octoplace">
                    <FooterLinkNav>Supported blockchains</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Linktree</FooterLinkNav>
                  </FooterLink>
                </FooterLinkNavs>
              </FooterLink>
              <FooterLink>
                <FooterLinkTitle>CONTACTS</FooterLinkTitle>
                <FooterLinkNavs>
                  <FooterLink link="">
                    <FooterLinkNav>Contact us</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Get verified</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Launchpad</FooterLinkNav>
                  </FooterLink>
                </FooterLinkNavs>
              </FooterLink>
              <FooterLink>
                <FooterLinkTitle>COMPANY</FooterLinkTitle>
                <FooterLinkNavs>
                  <FooterLink link="">
                    <FooterLinkNav>About us</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Project partnerships</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Blockchain partnerships</FooterLinkNav>
                  </FooterLink>
                  <FooterLink link="">
                    <FooterLinkNav>Brand Kit</FooterLinkNav>
                  </FooterLink>
                </FooterLinkNavs>
              </FooterLink>
            </FooterLinks>
          </FooterLinkContainer>
          <CDivider />
          <Col lg={11} sm={12} md={11}>
            <Box display="flex">
              <Box sx={styles.row}>
                <Typography>&#169; Copyright 2023</Typography>
              </Box>
              <Box sx={styles.legal}>
                <Box sx={styles.legalTextContainer}>
                  <Typography sx={styles.legalText}>
                    Terms & Conditions
                  </Typography>
                  <Typography sx={styles.legalText}>Privacy Policy</Typography>
                  <Typography sx={styles.legalText}>Risks Disclamer</Typography>
                  <Typography sx={styles.legalText}>Queries</Typography>
                </Box>
                <Box sx={styles.iconContainer}>
                  <IconButton
                    href="https://twitter.com/octoplace"
                    target="_blank"
                    sx={styles.icon}
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    target="_blank"
                    href="https://discord.gg/73Ru5XUP2X"
                    sx={styles.icon}
                  >
                    <FaDiscord />
                  </IconButton>
                  <IconButton
                    href={`mailto:${contactEmail}`}
                    target="_blank"
                    sx={styles.icon}
                  >
                    <EmailIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Col>
        </ContainerWrapper>
      </nav>
    </Fragment>
  );
};

const CDivider = styled(Divider)`
  width: 95%;
  background-color: white;
  height: 2;
  @media screen and (max-width: 768px) {
    width: 95vw;
  }
`;

const ContainerWrapper = styled.div`
  width: 100%;
  // max-width: 1440px;
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterExplain = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;
  @media screen and (max-width: 1120px) {
    gap: 35px;
    align-items: center;
  }
`;
const FooterLogo = styled.img`
  text-align: center;
  width: auto;
  height: 100px;
  cursor: pointer;
`;

const ExplainContent = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
  width: 400px;
  color: #f4f4f4;
  @media screen and (max-width: 1120px) {
    width: auto;
  }
  @media screen and (max-width: 768px) {
    text-align: center;
  }
  @media screen and (max-width: 450px) {
    width: 260px;
  }
`;

const ExplainContent1 = styled.div`
  font-size: 16px;
  // font-weight: 600;
  line-height: 20px;
  word-break: break-all;
  width: 400px;
  color: #f4f4f4;
  @media screen and (max-width: 1120px) {
    width: auto;
  }
  @media screen and (max-width: 768px) {
    text-align: center;
  }
  @media screen and (max-width: 450px) {
    width: 260px;
  }
`;

const FooterLinkContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 60px 20px 70px 20px;
  @media screen and (max-width: 1120px) {
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 100px;
  text-align: center;
  @media screen and (max-width: 1440px) {
    gap: 40px;
    justify-content: space-between;
  }
  @media screen and (max-width: 768px) {
    gap: 32px;
    justify-content: space-around;
  }
  @media screen and (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    justify-content: items-start;
    gap: 40px;
  }
`;

const FooterLinksWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 100px;
  @media screen and (max-width: 1120px) {
    /* justify-content: space-between; */
    gap: 75px;
  }
  @media screen and (max-width: 350px) {
    gap: 30px;
  }
`;

const FooterLink = styled.div`
  display: flex;
  flex-direction: column;
  gap: 45px;
  @media screen and (max-width: 768px) {
    width: 120px;
  }
  @media screen and (max-width: 425px) {
    gap: 30px;
  }
`;

const FooterLinkTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
  color: #f4f4f4;
  // font-family: "gotham-bold";
`;

const FooterLinkNavs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FooterLinkNav = styled.div`
  color: #f4f4f4;
  font-size: 15px;
  line-height: 18px;
  cursor: pointer;
  :hover {
    background: linear-gradient(99.95deg, #cd9bf4 8.73%, #432ad9 83.74%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
`;

const FooterSocialContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1120px) {
    flex-direction: column-reverse;
    gap: 75px;
  }
  @media screen and (max-width: 450px) {
    gap: 30px;
  }
`;

const FooterSocialContent = styled.div`
  color: #f4f4f4;
  font-size: 10px;
  line-height: 20px;
  width: 615px;
  @media screen and (max-width: 1120px) {
    width: auto;
  }
`;

const FooterSocialItems = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const FooterSocialItem = styled.img`
  width: 24px;
  height: auto;
  cursor: pointer;
  transition: all linear 0.2s;
  &:hover {
    filter: brightness(0) invert(1);
    color: #ffffff;
  }
  @media screen and (max-width: 450px) {
    width: 20px;
  }
`;
