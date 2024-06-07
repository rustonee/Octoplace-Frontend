import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {toast} from "react-toastify";
import { getNetworkInfo } from "../../connectors/networks";
import { useDispatch } from "react-redux";
import { showTxDialog, setTxDialogFailed, setTxDialogHash, setTxDialogPending, setTxDialogSuccess } from "../../redux/slices/app-slice";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

export const FaucetPage = () => {
  const dispatch = useDispatch();
  const {account, chainId} = useWeb3React();
  
  const handleRequestTokens = async () => {
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
        netInfo.dataNetwork.FAUCET,
        netInfo.dataNetwork.FAUCET_ABI,
        signer
      );
      const txResult = await contract.requestTokens();
      dispatch(setTxDialogHash(txResult.hash));
      await txResult.wait();
      toast.success("Wallet funded successfuly!");
      dispatch(setTxDialogSuccess(true));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(false));
    } catch (err) {
      console.log("Error", err);
      dispatch(setTxDialogSuccess(false));
      dispatch(setTxDialogPending(false));
      dispatch(setTxDialogFailed(true));
    }
  };
  return (
    <Container>
      <Row>
        <Col sm={12} xs={12} md={2} lg={3}></Col>
        <Col sm={12} xs={12} md={8} lg={6}>
          <Box
            sx={{
              maxWidth: "1280px",
              m: "16px auto",
              height: "100%",
              minHeight: "63vh",
              color: "#f4f4f4",
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>
              Click the button below to receive 1000 AURA Tokens. You can claim 1000 AURA tokens every 24 hours.
            </Typography>
           <Button disabled = {account ? false : true}  sx={{mt:2}} variant="contained" onClick={handleRequestTokens} >Get Tokens</Button>
          </Box>
        </Col>
        <Col sm={12} xs={12} md={2} lg={3}></Col>
      </Row>
    </Container>
  );
};
