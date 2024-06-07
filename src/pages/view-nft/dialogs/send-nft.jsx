import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { Cancel, Send } from "@mui/icons-material";
import { Web3Provider } from "@ethersproject/providers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../../redux/slices/app-slice";
import ercAbi from "../../../abi/erc721.json";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import { createAction } from "redux-actions";
import { getNetworkInfo } from "../../../connectors/networks";

export const SendNFT = ({
  network,
  isOpen,
  onCloseDlg,
  contractAddress,
  tokenId,
}) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { account, chainId } = useWeb3React();
  const theme = useTheme();

  const style = {
    btnSend: {
      "&:hover": {
        backgroundColor: "#F78C09",
        color: "#fff",
      },
    },
    btnCancel: {
      "&:hover": {
        backgroundColor: theme.palette.error.main,
        color: "#fff",
      },
    },
  };

  const handleClose = () => {
    onCloseDlg();
    setAddress("");
    setError(false);
  };

  const handleSend = async () => {
    if (isAddress(address)) {
      dispatch(showTxDialog());
      const netDetails = getNetworkInfo(network);
      if (chainId !== parseInt(netDetails.dataNetwork.CHAIN_ID)) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netDetails.switch],
        });
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      try {
        const contract = new Contract(contractAddress, ercAbi, signer);
        const txResult = await contract.transferFrom(account, address, tokenId);
        dispatch(setTxDialogHash(txResult.hash));
        await txResult.wait();
        dispatch(setTxDialogFailed(false));
        dispatch(setTxDialogSuccess(true));
        dispatch(setTxDialogPending(false));
        toast.success("NFT Transfer Successful!");
        dispatch(createAction("LOAD_MY_NFTS_API")({ account: account }));
        handleClose();
      } catch (err) {
        console.log(err);
        dispatch(setTxDialogFailed(true));
        dispatch(setTxDialogSuccess(false));
        dispatch(setTxDialogPending(false));
      }
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "white" }} className="tx-dialog">
        Send NFT
      </DialogTitle>
      <DialogContent className="tx-dialog">

        <TextField
          error={error}
          placeholder="Wallet Address (0x..)"
          sx={{
            border: `1px solid ${error ? theme.palette.error.main : "white"}`,
            color: "white !important",
          }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        {error && (
          <Typography
            sx={{ color: theme.palette.error.main }}
            variant="caption"
          >
            Enter a valid address.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }} className="tx-dialog">
        <Button
          onClick={handleClose}
          startIcon={<Cancel />}
          sx={[{ width: "100px" }, style.btnCancel]}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          startIcon={<Send />}
          sx={[{ width: "100px" }, style.btnSend]}
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
