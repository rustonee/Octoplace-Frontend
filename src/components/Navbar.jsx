import Container from "react-bootstrap/Container";
import React from "react";
import LogoBeta from "../assets/Logo-beta.png";
import Logo from "../assets/logo.png";
import { styled } from "@mui/system";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { ConnectWalletDlg } from "./connect-wallet-dlg";
import { GoProDlg } from "./go-pro-dlg";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import CollectionsIcon from "@mui/icons-material/Collections";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { getNetworkInfo } from "../connectors/networks";
import ThetaLogo from "../assets/chains/thetaLogo.svg";
import KavaLogo from "../assets/chains/kavaLogo.svg";

import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

import { setLogout } from "../redux/slices/accout-slice";

const WalletButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "105.02%",
  backgroundColor: "#f4f4f4",
  color: "#262626",
  borderRadius: "12px",
  padding: "8px 32px",
  // "&:hover": {
  //   backgroundColor: "#262626",
  //   color: "#f4f4f4",
  //   boxShadow: "none",
  //   border: "1px solid #262626",
  // },
});

export const AppNavbar = () => {
  const sendDataToGTM = useGTMDispatch();
  const dispatch = useDispatch();
  const [dlgOpen, setDlgOpen] = useState(false);
  const { deactivate, chainId } = useWeb3React();
  const navigate = useNavigate();
  const acctDetails = useSelector((state) => state.account);

  useEffect(() => {}, [acctDetails]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorChainEl, setAnchorChainEl] = useState(null);
  const [switchingChain, setSwitchingChain] = useState(false);
  const [goProDlgOpen, setGoProDlgOpen] = useState(false);
  const openMenu = Boolean(anchorEl);
  const isOpen = Boolean(anchorEl1);
  const openChainMenu = Boolean(anchorChainEl);

  const switchNetwork = async (chain) => {
    if (window.ethereum) {
      try {
        setSwitchingChain(true);
        const netInfo = getNetworkInfo(chain);
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netInfo.switch],
        });
        setSwitchingChain(false);
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    } else {
      toast("Metamask not detected. Please install Metamask.", {
        type: "error",
      });
    }
  };

  const handleChainBtnClick = (event) => {
    setAnchorChainEl(event.currentTarget);
  };

  const handleChainMenuClose = (chain) => {
    setAnchorChainEl(null);
    if (chain && typeof chain === "string") {
      switchNetwork(chain);
    }
  };

  const handleBtnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClose1 = () => {
    setAnchorEl1(null);
  };

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleGoProOpen = () => {
    setGoProDlgOpen(true);
    sendDataToGTM({
      event: "Opened Go Pro Popup",
    });
  };

  const handleGoProClose = () => {
    setGoProDlgOpen(false);
    sendDataToGTM({
      event: "Closed Go Pro Popup",
    });
  };

  const handleWalletOpen = () => {
    setDlgOpen(true);
    sendDataToGTM({
      event: "View Connect Wallet Popup",
    });
  };

  const handleWalletClose = () => {
    setDlgOpen(false);
    sendDataToGTM({
      event: "Closed Wallet Popup",
    });
  };

  return (
    <NavBarContainer>
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // display: "block",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Img alt="logo icon" onClick={() => navigate("/")} />
          {/* <IconButton onClick={() => navigate("/faucet")}>
            <img src={faucetImg} alt="faucet" />
          </IconButton> */}
          <MobileNavBarItemContainer>
            <IconButton aria-label="delete" size="large" onClick={handleClick}>
              <MenuIcon fontSize="inherit" sx={{ color: "#FFFFFF" }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl1}
              open={isOpen}
              onClose={handleMenuClose1}
              sx={{ marginTop: "8px" }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/market");
                  handleMenuClose1();
                }}
              >
                <LocalGroceryStoreIcon /> &nbsp;Market
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/collections");
                  handleMenuClose1();
                }}
              >
                <CollectionsIcon /> &nbsp;Collections
              </MenuItem>
              {/* <MenuItem sx={{ color: "#808080" }}>
                <ForwardToInboxIcon /> &nbsp;Inbox
              </MenuItem> */}
              <MenuItem>
                <ForwardToInboxIcon /> &nbsp;GO PRO
              </MenuItem>
            </Menu>
          </MobileNavBarItemContainer>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NavBarItemContainer style={{ paddingRight: "40px" }}>
            <NavItem onClick={() => navigate("/market")}>Market</NavItem>
            <NavItem onClick={() => navigate("/collections")}>
              Collections
            </NavItem>
            {/* <NavItem disabled={true}>Inbox</NavItem> */}
            <NavItem sx={{ fontSize: "16px" }} onClick={handleGoProOpen}>
              GO PRO
            </NavItem>
          </NavBarItemContainer>
          {acctDetails && !acctDetails.isLoggedIn && (
            <WalletButton
              className="connect-btn"
              onClick={handleWalletOpen}
              variant="contained"
            >
              Connect Wallet
            </WalletButton>
          )}
          {acctDetails && acctDetails.isLoggedIn && (
            <>
              <Button
                // className="connect-btn"
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  height: "32px",
                }}
                onClick={handleChainBtnClick}
                variant="contained"
                disabled={switchingChain}
              >
                {switchingChain && (
                  <Typography
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    <CircularProgress
                      style={{
                        color: "black",
                        width: "20px",
                        height: "20px",
                        alignItems: "center",
                      }}
                    />
                    &nbsp;Switching
                  </Typography>
                )}
                {!switchingChain && (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        width: chainId === 361 ? "20px" : "15px",
                        height: chainId === 361 ? "20px" : "15px",
                      }}
                      src={chainId === 361 ? ThetaLogo : KavaLogo}
                      alt="network"
                    />
                    &nbsp;{chainId === 361 ? "THETA" : "KAVA"}
                  </Box>
                )}
              </Button>
              <Button
                className="connect-btn"
                onClick={handleBtnClick}
                variant="contained"
              >
                {getAccountString(acctDetails.address)} &nbsp;|{" "}
                {acctDetails.balance} {chainId === 361 ? "TFUEL" : "KAVA"}
              </Button>
            </>
          )}
        </div>
      </Container>
      <Menu
        id="basic-menu"
        anchorEl={anchorChainEl}
        open={openChainMenu}
        onClose={handleChainMenuClose}
        sx={{ marginTop: "8px" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          style={{ fontSize: "0.9rem" }}
          onClick={() => {
            handleChainMenuClose("theta");
          }}
        >
          <img
            style={{ width: "20px", height: "20px" }}
            src={ThetaLogo}
            alt="network"
          />
          &nbsp;THETA
        </MenuItem>
        <MenuItem
          style={{ fontSize: "0.9rem" }}
          onClick={() => {
            handleChainMenuClose("kava");
          }}
        >
          <img
            style={{ width: "15px", height: "15px", margin: "0 2px 0 4px" }}
            src={KavaLogo}
            alt="network"
          />
          &nbsp;KAVA
        </MenuItem>
      </Menu>
      <ConnectWalletDlg open={dlgOpen} onClose={handleWalletClose} />
      <GoProDlg open={goProDlgOpen} onClose={handleGoProClose} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        sx={{ marginTop: "8px" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            sendDataToGTM({
              event: "Opened Dashboard",
              customData: {
                address: (acctDetails && acctDetails.address) || "",
              },
            });

            navigate("/dashboard");
            handleMenuClose();
          }}
        >
          <DashboardIcon /> &nbsp;My Dashboard
        </MenuItem>
        <MenuItem
          onClick={() => {
            sendDataToGTM({
              event: "Opened Settings",
              customData: {
                address: (acctDetails && acctDetails.address) || "",
              },
            });

            navigate("/dashboard/settings");
            handleMenuClose();
          }}
        >
          <SettingsIcon /> &nbsp;Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            sendDataToGTM({
              event: "Logged Out",
              customData: {
                address: (acctDetails && acctDetails.address) || "",
              },
            });

            dispatch(setLogout());

            deactivate();
            navigate("/");
            handleMenuClose();
          }}
        >
          <LogoutIcon /> &nbsp;Logout
        </MenuItem>
      </Menu>
    </NavBarContainer>
  );
};

const getAccountString = (hash) => {
  const first = hash.substring(0, 3);
  const len = hash.length;
  const last = hash.substring(len - 4, len);
  return `${first}...${last}`;
};

const Img = styled("img")(({ theme }) => ({
  content: `url(${LogoBeta})`,
  height: "66px",
  cursor: "pointer",
  [theme.breakpoints.down(768)]: {
    content: `url(${Logo})`,
    height: "40px",
  },
}));

const NavBarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "92px",
  backgroundColor: "#262626",
  padding: "8px 0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const NavBarItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "56px",
  [theme.breakpoints.down(992)]: {
    display: "none",
  },
}));

const NavItem = styled(Box)(({ theme, disabled }) => ({
  fontWeight: "700",
  color: disabled === true ? "#808080" : "#FFFFFF",
  fontSize: "16px",
  cursor: "pointer",
}));

const MobileNavBarItemContainer = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down(992)]: {
    display: "flex",
  },
}));

// {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//           <Navbar.Collapse id="responsive-navbar-nav">
//             {/* <Nav className="me-auto">
//               <Searchbox className="search-nav" type="text" />
//             </Nav> */}
//             <span style={{ flex: "1 auto" }}></span>
//             <Nav>
//               <Nav.Link onClick={() => navigate("/market")}>Market</Nav.Link>
//               <Nav.Link onClick={() => navigate("/collections")}>
//                 Collections
//               </Nav.Link>
//               <Nav.Link disabled>Inbox</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//           {acctDetails && !acctDetails.isLoggedIn && (
//             <WalletButton
//               className="connect-btn"
//               onClick={() => setDlgOpen(true)}
//               variant="contained"
//             >
//               Connect Wallet
//             </WalletButton>
//           )}
//           {acctDetails && acctDetails.isLoggedIn && (
//             <Button
//               className="connect-btn"
//               onClick={handleBtnClick}
//               variant="contained"
//             >
//               {getAccountString(acctDetails.address)} &nbsp;|{" "}
//               {acctDetails.balance} {chainId === 361 ? "TFUEL" : "KAVA"}
//             </Button>
//           )} */}
