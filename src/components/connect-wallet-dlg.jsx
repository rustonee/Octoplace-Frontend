import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import mm from "../assets/metamask.svg";
import wc from "../assets/walletconnect.svg";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Box, Divider, DialogContent } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getNetworkInfo } from "../connectors/networks";
import {
  activateInjectedProvider,
  injectedConnector,
} from "../connectors/injected-connector";
import { walletconnect } from "../connectors/wallet-connect";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { UnsupportedChainIdError } from "@web3-react/core";
import {
  UserRejectedRequestError,
  NoEthereumProviderError,
} from "@web3-react/injected-connector";

import { loggingWalletConnect } from "../redux/thunk/user-setting";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export const ConnectWalletDlg = (props) => {
  const { onClose, open } = props;
  const { activate, error, account } = useWeb3React();
  const sendDataToGTM = useGTMDispatch();

  const handleClose = () => {
    onClose();
  };

  const handleMetamaskClick = async () => {
    sendDataToGTM({
      event: "Selected Metamask",
    });

    activateInjectedProvider("MetaMask");
    await activate(injectedConnector);
    handleClose();
  };

  const handleWalletConnectClick = async () => {
    sendDataToGTM({
      event: "Selected Wallet Connect",
    });

    await activate(walletconnect);
    handleClose();
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        const netInfo = getNetworkInfo("theta");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netInfo.switch],
        });
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    } else {
      toast("Metamask not detected. Please install Metamask.", {
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (account && account !== "" && account.length > 0) {
      toast(`Wallet Connected! ${getAccountString(account)}`, {
        type: "success",
        position: "bottom-left",
      });

      // logging
      loggingWalletConnect(account);
    }
  }, [account]);

  useEffect(() => {
    if (error) {
      console.log(error);
      // switch (error.name) {
      //   case "UnsupportedChainIdError":
      //     // toast("Unsupported network, Switch to Theta Mainnet", {type: "error"})
      //     switchNetwork();
      //     break;
      //   case "NoEthereumProviderError":
      //     toast("Please Install metamask.", { type: "error" });
      //     break;
      //   case "UserRejectedRequestError":
      //     toast("Connection request rejected.", { type: "warning" });
      //     break;
      //   default:
      //     break;
      // }
      if (error instanceof UnsupportedChainIdError) {
        switchNetwork();
      } else if (error instanceof NoEthereumProviderError) {
        toast("Please Install metamask.", { type: "error" });
      } else if (error instanceof UserRejectedRequestError) {
        toast("Connection request rejected.", { type: "warning" });
      }
    }
  }, [error]);

  return (
    <Dialog fullWidth onClose={handleClose} open={open} className="wallet-dlg">
      <DialogTitle className="title">
        <Box display="flex" flexDirection="row" alignItems="center">
          <AccountBalanceWalletIcon className="icon" />
          <Typography sx={{ ml: "8px" }} variant="h5">
            Connect wallet
          </Typography>
          <span className="spacer"></span>
          <IconButton onClick={handleClose}>
            <CloseIcon className="icon" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem
            button
            onClick={handleMetamaskClick}
            className="wallet-menu"
          >
            <ListItemAvatar>
              <img className="wallet-logo" src={mm} alt="metamask" />
            </ListItemAvatar>
            <ListItemText primary="Metamask" />
          </ListItem>
          <ListItem
            button
            onClick={handleWalletConnectClick}
            className="wallet-menu"
          >
            <ListItemAvatar>
              <img className="wallet-logo" src={wc} alt="metamask" />
            </ListItemAvatar>
            <ListItemText primary="Wallet Connect" />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

const getAccountString = (hash) => {
  const first = hash.substring(0, 7);
  const len = hash.length;
  const last = hash.substring(len - 7, len);
  return `${first}...${last}`;
};
