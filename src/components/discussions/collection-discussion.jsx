/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ContentCopy, ExpandMore, QuestionAnswer } from "@mui/icons-material";
import { shortenAddress } from "../../utils/string-util";
import { getNetworkInfo } from "../../connectors/networks";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { formatEther, parseUnits } from "@ethersproject/units";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setTxDialogFailed,
  setTxDialogHash,
  setTxDialogPending,
  setTxDialogSuccess,
  showTxDialog,
} from "../../redux/slices/app-slice";
import copy from "clipboard-copy";
// import { setCollectionDiscussions } from "../../redux/slices/discussions-slice";
import {
  createCollectionDiscussion,
  getCollectionDiscussions,
} from "../../redux/thunk/get-discussions";

import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export const CollectionDiscussions = ({
  address,
  network,
  // discussions,
  isAccordion,
}) => {
  const sendDataToGTM = useGTMDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const [openSendDlg, setOpenSendDlg] = useState(false);
  const [message, setMessage] = useState("");
  const [feeToken, setFeeToken] = useState("");
  const [commentFee, setCommentFee] = useState(0);
  const [feeBalance, setFeeBalance] = useState("");
  const [feeSymbol, setFeeSymbol] = useState("");
  const { account, chainId } = useWeb3React();
  const [feeAllowance, setFeeAllowance] = useState(0);
  const [loadingAllowance, setLoadingAllowance] = useState(false);
  // const [allowanceRefreshTrigger, setAllowanceRefreshTrigger] = useState(0);
  const discussions = useSelector(
    (state) => state.discussion.selectedCollectionDiscussions
  );

  // const ownerMessages = discussions.filter(
  //   (message) => message.senderAddress === account
  // );

  const dispatch = useDispatch();
  const format = (x) => {
    return x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch(setCollectionDiscussions([]));
  //   };
  // }, []);
  const getFeeToken = async () => {
    const netInfo = getNetworkInfo("theta");
    const provider = new JsonRpcProvider(netInfo.dataNetwork.RPC);
    const contract = new Contract(
      netInfo.dataNetwork.COLLECTION_DISCUSSION_CONTRACT,
      netInfo.dataNetwork.COLLECTION_DISCUSSION_ABI,
      provider
    );

    const feeTokenAddress = await contract.erc20Token();
    setFeeToken(feeTokenAddress);

    const fee = await contract.commentFee();
    setCommentFee(Number(formatEther(fee)));

    const tokenContract = new Contract(
      feeTokenAddress,
      netInfo.dataNetwork.FEE_ABI,
      provider
    );
    const symb = await tokenContract.symbol();
    setFeeSymbol(symb);
    const bal = await tokenContract.balanceOf(account);
    setFeeBalance(format(Number(formatEther(bal))));
    getAllowance();
  };

  const getDiscussions = async () => {
    dispatch(getCollectionDiscussions({ address, network, owner: account }));
  };

  useEffect(() => {
    if (address) {
      getDiscussions();
    }
  }, [address]);

  const getAllowance = async () => {
    const netInfo = getNetworkInfo("theta");
    const provider = new JsonRpcProvider(netInfo.dataNetwork.RPC);
    const tokenContract = new Contract(
      feeToken,
      netInfo.dataNetwork.FEE_ABI,
      provider
    );
    const allowedAmt = await tokenContract.allowance(
      account,
      netInfo.dataNetwork.COLLECTION_DISCUSSION_CONTRACT
    );
    setFeeAllowance(Number(formatEther(allowedAmt)));
  };

  useEffect(() => {
    if (account && feeToken) {
      getAllowance();
    }
  }, [account, feeToken]);

  useEffect(() => {
    const fetchAllowance = async () => {
      setLoadingAllowance(true);
      await getFeeToken();
      setLoadingAllowance(false);
    };

    if (account) {
      fetchAllowance();
    }

    // if isAccordion is false expand the accordion default
    if (!isAccordion) {
      setExpanded(true);
    }
  }, [account]);

  //useEffect(() => { }, [discussions]);

  const handleFeeApprove = async () => {
    sendDataToGTM({
      event: "Approved Comment Function (Collection Discussion)",
      customData: { "Collection Address": address },
    });

    const netInfo = getNetworkInfo("theta");
    dispatch(showTxDialog());
    try {
      if (chainId !== parseInt(netInfo.dataNetwork.CHAIN_ID)) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netInfo.switch],
        });
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new Contract(
        feeToken,
        netInfo.dataNetwork.FEE_ABI,
        signer
      );
      const txResult = await contract.approve(
        netInfo.dataNetwork.COLLECTION_DISCUSSION_CONTRACT,
        parseUnits(commentFee.toString(), "ether")
      );

      sendDataToGTM({
        event: "Sent Comment (Collection Discussion)",
        customData: { "Collection Address": address },
      });

      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      toast.success("Approval Successful!");
      getAllowance();
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));

      sendDataToGTM({
        event: "View Transaction Successful Popup (Collection Discussion)",
        customData: { "Collection Address": address },
      });
    } catch (err) {
      console.log("Error");
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));

      sendDataToGTM({
        event: "View Transaction Failed Popup (Collection Discussion)",
        customData: { "Collection Address": address },
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message) {
      return;
    }

    const netInfo = getNetworkInfo("theta");
    dispatch(showTxDialog());
    try {
      if (chainId !== parseInt(netInfo.dataNetwork.CHAIN_ID)) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [netInfo.switch],
        });
      }
      const provider = new Web3Provider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new Contract(
        netInfo.dataNetwork.COLLECTION_DISCUSSION_CONTRACT,
        netInfo.dataNetwork.COLLECTION_DISCUSSION_ABI,
        signer
      );
      const txResult = await contract.addComment_erc20(address, message);
      dispatch(setTxDialogHash(txResult.hash));

      await txResult.wait();

      dispatch(
        createCollectionDiscussion({
          address,
          network,
          sender: account,
          message,
        })
      );

      toast.success("Comment Posted Successfuly!");
      setMessage("");

      setOpenSendDlg(false);
      setMessage("");
      getAllowance();
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
    } catch (err) {
      console.log("Error", err);
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }

    // For test without auth
    // dispatch(
    //   createCollectionDiscussion({
    //     address,
    //     network,
    //     sender: account,
    //     message,
    //   })
    // );
    // toast.success("Comment Posted Successfuly!");
    // setMessage("");
  };

  const styles = {
    accordion2: {
      backgroundColor: "transparent",
      color: expanded ? "#f4f4f4" : "#6c6c6c",
      border: "1px solid  #6C6C6C",
      borderRadius: ".5rem",
      marginBottom: "1rem",
    },
    accordionHeader: {
      fontWeight: 400,
      fontsize: "1.125rem",
      lineHeight: "105.02%",
    },
    accordionBody: {
      backgroundColor: "#151515",
      display: "flex",
      flexDirection: "column",
      gap: 1,
      maxHeight: "470px",
      overflowY: "scroll",
      borderRadius: ".5rem",
    },
    detailsBox: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxHeight: "470px",
      overflowY: "scroll",
      justifyContent: "flex-start",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginTop: "15px",
      marginBottom: "8px",
    },
    comments: {
      width: "100%",
    },
    address: {
      fontWeight: 600,
      fontSize: ".875rem",
      color: "#FF9719",
      textTransform: "none",
      display: "flex",
      alignItems: "center",
    },
    copyButton: {
      color: "#6C6C6C",
      fontSize: ".75rem",
    },
    message: {
      color: "white",
      fontSize: ".875rem",
      fontWeight: 400,
    },
    textContainer: {
      width: "80%",
      pt: 2,
      pr: 1,
    },
    sendButton: {
      background: "#F78C09",
      borderRadius: ".375rem",
      color: "#262626",
      fontWeight: 600,
      width: "20%",
      textTransform: "none",
      "&:disabled": {
        opacity: 0.3,
        cursor: "not-allowed",
        background: "#F78C09",
        color: "#262626",
      },
    },
  };

  return (
    <Box sx={{ marginBottom: "30px" }}>
      <Accordion
        sx={styles.accordion2}
        expanded={expanded}
        onChange={handleChange}
      >
        {isAccordion ? (
          <AccordionSummary
            expandIcon={
              <ExpandMore sx={{ color: expanded ? "#f4f4f4" : "#6c6c6c" }} />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography sx={styles.accordionHeader}>
              <QuestionAnswer /> &nbsp;&nbsp;Discussion
            </Typography>
          </AccordionSummary>
        ) : (
          <div></div>
        )}
        <AccordionDetails sx={styles.accordionBody}>
          <Box sx={styles.detailsBox}>
            {discussions.map((item) => {
              return (
                <Box key={item._id} sx={styles.comments}>
                  <Typography sx={styles.address}>
                    {shortenAddress(item.senderAddress)}
                    <IconButton
                      onClick={() => {
                        copy(item.senderAddress);
                        toast.success("Address copied!");
                      }}
                      sx={styles.copyButton}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Typography>
                  <Typography sx={styles.message} variant="body1">
                    {item.message}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={styles.row}>
            <Box sx={styles.textContainer}>
              <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                maxRows={5}
                autoComplete="no"
                autofill="no"
                sx={{ color: "white" }}
                variant="standard"
                fullWidth
                placeholder="Enter your message here"
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
            <LoadingButton
              fullWidth
              variant="contained"
              loading={loadingAllowance}
              loadingPosition="start"
              onClick={() => {
                sendDataToGTM({
                  event: "Click Send Collection Message",
                  customData: { "Collection Address": address },
                });

                if (!message) {
                  return;
                }

                if (!account) {
                  toast.info("Please connect your wallet!");
                  return;
                }

                if (feeBalance < commentFee) {
                  toast.warning("Insufficient funds for gas.");
                  return;
                }

                sendDataToGTM({
                  event: "Opened Add Comment Popup (Collection Discussion)",
                  customData: { "Collection Address": address },
                });

                setOpenSendDlg(true);
              }}
              sx={styles.sendButton}
            >
              {loadingAllowance ? "Getting an allowance..." : "Send"}
            </LoadingButton>
          </Box>
          <Dialog maxWidth={"xs"} fullWidth open={openSendDlg}>
            <DialogTitle
              sx={{
                color: "white",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
              className="tx-dialog"
            >
              Add Comment
            </DialogTitle>
            <DialogContent className="tx-dialog">
              <Typography>
                Your {feeSymbol} Balance: {`${feeBalance} ${feeSymbol}`}
              </Typography>
              <Typography>
                {feeSymbol} Required: &nbsp; &nbsp;{" "}
                {`${commentFee} ${feeSymbol}`}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ pb: 2, pr: 2 }} className="tx-dialog">
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  sendDataToGTM({
                    event: "Closed Add Comment Popup (Collection Discussion)",
                    customData: { "Collection Address": address },
                  });

                  setOpenSendDlg(false);
                }}
              >
                Cancel
              </Button>
              {feeAllowance >= commentFee ? (
                <Button onClick={handleSendMessage} variant="contained">
                  Send Message
                </Button>
              ) : (
                <Button onClick={handleFeeApprove} variant="contained">
                  Approve
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};