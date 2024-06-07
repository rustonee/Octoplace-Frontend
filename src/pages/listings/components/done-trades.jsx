import React, { Fragment } from "react";
import { Grid , CircularProgress} from "@mui/material";
import { useSelector } from "react-redux";
import { TradeCard } from "./trade-card";
export const CompletedSwaps = () => {
  const trades = useSelector((state) => state.trades.trades);
    const loading = useSelector((state) => state.trades.isLoading)
  return (
    <Fragment>
      <Grid container spacing={2}>
        {trades.length > 0 &&
          trades.map((item, index) => {
            return (
              <Grid key={`index_${index}`} item lg={4} xs={12} sm={12} md={6}>
                <TradeCard number={index} trade={item} />
              </Grid>
            );
          })}
        {
            loading && 
                <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginTop: "10vh",
                    }}
                  >
                    <CircularProgress color="primary" />
                  </div>
            
        }
      </Grid>
    </Fragment>
  );
};
