/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
// import { Cancel, Send } from "@mui/icons-material";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../../redux/slices/app-slice";
import ercAbi from "../../../abi/erc721.json";
import { useTheme } from "@mui/material";
import { toast } from "react-toastify";
// import { createAction } from "redux-actions";
import { getNetworkInfo } from "../../../connectors/networks";
import { getImageUrl } from "../../../utils/string-util";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const SellNFT = ({
  network,
  isOpen,
  onCloseDlg,
  contractAddress,
  tokenId,
  metadata,
  isUpdate,
  itemPrice,
  marketId,
  listingId,
}) => {
  const theme = useTheme();
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const styles = {
    imgBox: {
      width: "100%",
      height: "100%px",
      backgroundColor: "#3c3c3c",
    },
    btnApprove: {
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
  const [price, setPrice] = useState(0.0);
  const [salesFee, setSalesFee] = useState(0);
  const [creatorFee, setCreatorFee] = useState(0);
  const [approved, setApproved] = useState(false);
  const dispatch = useDispatch();
  const [imgUrl, setUrl] = useState("");
  const { account, chainId } = useWeb3React();
  const [setAnimation] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const handleClose = () => {
    onCloseDlg();
  };
  useEffect(() => {
    setPrice(itemPrice);
    if (metadata) {
      try {
        if (metadata.image) {
          setUrl(getImageUrl(metadata.image));
        } else if (metadata.aimation_url) {
          setAnimation(true);
          setUrl(getImageUrl(metadata.animation_url));
        }
      } catch (e) {
        setUrl("");
      }
    }
  }, [metadata]);

  useEffect(() => {
    if (network) {
      getApprovalStatus();
      getDetails();
    }
  }, [network]);
  const getApprovalStatus = async () => {
    const netDetails = getNetworkInfo(network);
    const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);

    try {
      const nftContract = new Contract(contractAddress, ercAbi, provider);
      const approvedAddr = await nftContract.getApproved(tokenId);
      if (
        approvedAddr.toUpperCase().trim() ===
        netDetails.dataNetwork.MARKETPLACE_CONTRACT.toUpperCase().trim()
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getDetails = async () => {
    const netDetails = getNetworkInfo(network);
    const provider = new JsonRpcProvider(netDetails.dataNetwork.RPC);

    try {
      const marketContract = new Contract(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        netDetails.dataNetwork.MARKET_ABI,
        provider
      );
      const fee = await marketContract.getSalesFee();
      setSalesFee(Number(formatUnits(fee, 0)));
      console.log(Number(formatUnits(fee, 0)));

      let payout = await marketContract.getCreatorFeeBasisPoints(
        contractAddress
      );
      if (payout.creator === zeroAddress) {
        //royalty from EIP2981
        const contract = new Contract(contractAddress, ercAbi, provider);
        const isRoyaltyAvlbl = await contract.supportsInterface("0x2a55205a");
        if (isRoyaltyAvlbl) {
          payout = await contract.royaltyInfo(
            tokenId,
            parseUnits(price.toString())
          );
          const val =
            (Number(formatUnits(payout.royaltyAmount, "ether")) / price) *
            10000;
          console.log(val);
          setCreatorFee(val);
        }
      } else {
        setCreatorFee(formatUnits(payout.feeBasisPoints, 0));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleApprove = async () => {
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
      const txResult = await contract.approve(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        tokenId
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      dispatch(setTxDialogFailed(false));
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      toast.success("NFT Approval Successful!");
      await getApprovalStatus();
    } catch (err) {
      console.log(err);
      dispatch(setTxDialogFailed(true));
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
    }
  };

  const handleUpdate = async () => {
    if (checkPrice()) {
      return;
    }
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
      const contract = new Contract(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        netDetails.dataNetwork.MARKET_ABI,
        signer
      );
      console.log("marketId ", marketId);
      const txResult = await contract.updateMarketItem(
        contractAddress,
        tokenId,
        parseUnits(price.toString()),
        marketId
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      dispatch(setTxDialogFailed(false));
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      toast.success("NFT Listing Successful!");

      await getApprovalStatus();
      handleClose();
    } catch (err) {
      console.log(err);
      dispatch(setTxDialogFailed(true));
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
    }
  };

  const handleList = async () => {
    if (checkPrice()) {
      return;
    }
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
      const contract = new Contract(
        netDetails.dataNetwork.MARKETPLACE_CONTRACT,
        netDetails.dataNetwork.MARKET_ABI,
        signer
      );
      const txResult = await contract.createMarketItem(
        contractAddress,
        tokenId,
        parseUnits(price.toString()),
        metadata.name
      );
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      const id = await contract.getLastMarketId();
      dispatch(setTxDialogFailed(false));
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      toast.success("NFT Listing Successful!");

      await getApprovalStatus();
      handleClose();
    } catch (err) {
      console.log(err);
      dispatch(setTxDialogFailed(true));
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
    }
  };

  const checkPrice = () => {
    if (price === itemPrice) {
      toast.warning("Price must different than original value!");
      return true;
    }
    if (price === "") {
      toast.warning("Price must set a value!");
      return true;
    }
    if (Number(price.toString()) <= 0) {
      toast.warning("Price must be higher than 0!");
      return true;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "white" }} className="tx-dialog">
        {approved ? "List NFT" : "Approve NFT"}
      </DialogTitle>
      <DialogContent className="tx-dialog">
        <Grid container>
          <Grid item xl={12} lg={12} md={12} sm={12}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"flex-start"}
            >
              {metadata && (
                <img
                  alt="kjbhv"
                  src={imgUrl}
                  style={{
                    width: "40%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: ".75rem",
                  }}
                  onLoad={() => setImgLoaded(true)}
                />
              )}
              {!imgLoaded && (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={styles.imgBox}
                >
                  <CircularProgress color="primary" />
                </Box>
              )}
              <Box sx={{ marginLeft: "1.5rem" }}>
                <Box>
                  {metadata && (
                    <Typography variant="h6">{metadata.name}</Typography>
                  )}
                  <Typography>{`#${tokenId}`}</Typography>
                  {(approved || isUpdate) && (
                    <>
                      <TextField
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography sx={{ color: "#fff" }}>
                                TFUEL
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ style: { textAlign: "right" } }}
                        sx={{ mt: 2, width: "12rem" }}
                        autoComplete="off"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        onFocus={(e) => setPrice("")}
                      />
                      <Box>
                        <Typography variant="caption">
                          Fee on sale{" "}
                          {(Number(salesFee) + Number(creatorFee)) / 100}%
                          (Platform fee {Number(salesFee) / 100}%, Creator fee{" "}
                          {Number(creatorFee) / 100}%)
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          {!approved && !isUpdate && (
            <Typography sx={{ mt: 2 }}>
              Please approve this NFT to list for sale.
            </Typography>
          )}
          {approved && !isUpdate && (
            <Typography sx={{ mt: 2 }}>
              Please click "Confirm" to proceed with listing.
            </Typography>
          )}
          {isUpdate && (
            <Typography sx={{ mt: 2 }}>
              Please click "Update" to update the sale price.
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }} className="tx-dialog">
        <Button
          onClick={handleClose}
          sx={[{ width: "100px" }, styles.btnCancel]}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
        {!approved && !isUpdate && (
          <Button
            onClick={handleApprove}
            sx={[{ width: "100px" }, styles.btnApprove]}
            variant="contained"
            color="primary"
          >
            Approve
          </Button>
        )}
        {approved && !isUpdate && (
          <Button
            sx={[{ width: "100px" }, styles.btnApprove]}
            onClick={handleList}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        )}
        {isUpdate && (
          <Button
            sx={[{ width: "100px" }, styles.btnApprove]}
            onClick={handleUpdate}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
