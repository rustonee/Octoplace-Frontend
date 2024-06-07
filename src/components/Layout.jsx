import { Fragment } from "react";
import { Footer } from "./Footer";
import { AppNavbar } from "./Navbar";
import { styled } from "@mui/system";
import { Box } from "@mui/material";

export const Layout = ({ children }) => {
  return (
    <Fragment>
      <AppNavbar />
      <MainContainer>{children}</MainContainer>
      <Footer />
    </Fragment>
  );
};

const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 92px - 400px)",
  width: "100%",
}));
