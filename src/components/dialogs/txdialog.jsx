import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React from "react";
// import { GridLoader } from "react-spinners";
import successGif from "../../assets/success.gif";
import errorGif from "../../assets/close.gif";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { hideTxDialog } from "../../redux/slices/app-slice";
import logoAnim from "../../assets/logo_anim_4.svg";

export const TxDialog = ({
  handleClose,
  isOpen,
  isPending,
  isSuccessful,
  isFailed,
  txHash,
}) => {
  const { chainId } = useWeb3React();
  const dispatch = useDispatch();
  const theme = useTheme();
  return (
    <Dialog maxWidth={"xs"} fullWidth open={isOpen}>
      <DialogTitle
        sx={{ color: "white", textTransform: "uppercase", fontWeight: 700 }}
        className="tx-dialog"
      >
        Transaction Status
      </DialogTitle>
      <DialogContent className="tx-dialog">
        <Box
          sx={{ pt: 2, pb: 2 }}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {/* {isPending && <GridLoader color={theme.palette.primary.dark} />} */}
          {isPending && (
            <img
              style={{ width: "80px", height: "80px" }}
              src={logoAnim}
              alt="pendding"
            />
          )}
          {isSuccessful && (
            <img
              style={{ width: "80px", height: "80px" }}
              src={successGif}
              alt="operation successful"
            />
          )}
          {isFailed && (
            <img
              style={{ width: "80px", height: "80px" }}
              src={errorGif}
              alt="operation successful"
            />
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {isPending && (
            <Typography
              sx={{
                fontSize: "20px",
                color: "white",
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              Transaction Pending
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#F78C09",
                  fontWeight: 100,
                  textAlign: "center",
                }}
              >
                This may take a few seconds
              </Typography>
            </Typography>
          )}
          {isFailed && (
            <Typography
              sx={{ fontSize: "20px", color: "white", fontWeight: 400 }}
            >
              Transaction Failed
            </Typography>
          )}
          {isSuccessful && (
            <Typography
              sx={{ fontSize: "20px", color: "white", fontWeight: 400 }}
            >
              Transaction Successful
            </Typography>
          )}
        </Box>
        {txHash && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <a
              href={`${getexplorerUrl(chainId)}${txHash}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: theme.palette.secondary.dark }}
            >
              <Typography>View on Explorer</Typography>
            </a>
          </Box>
        )}
      </DialogContent>
      <DialogActions className="tx-dialog" sx={{ pb: 3 }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {(isSuccessful || isFailed) && (
            <Button
              sx={{ ml: 1, mr: 1, width: "120px" }}
              variant="contained"
              color="primary"
              onClick={() => dispatch(hideTxDialog())}
            >
              Close
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

function getexplorerUrl(chainId) {
  switch (Number(chainId)) {
    case 361:
      return "https://explorer.thetatoken.org/txs/";
    case 2222:
      return "https://explorer.kava.io/tx/";
    default:
      return "https://etherscan.io/tx";
  }
}
