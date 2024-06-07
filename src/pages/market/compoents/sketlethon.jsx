import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box, Grid } from "@mui/material";
import { Container } from "react-bootstrap";

function Skelethon() {
  const styles = {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
    text: {
      fontSize: "2rem",
      width: 100,
      backgroundColor: "#6C6C6C",
    },
    titleRow: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 5,
    },
    cardRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 5,
      flexWrap: "wrap",
    },
    card: {
      width: 180,
      height: 280,
      backgroundColor: "#6C6C6C",
    },
  };
  return (
    <Container>
      <Grid spacing={5}>
        <Box sx={styles.root}>
          <Skeleton variant="text" sx={styles.text} />
          <Skeleton variant="text" sx={styles.text} />
          <Skeleton variant="text" sx={styles.text} />
        </Box>
        <Box sx={styles.titleRow}>
          <Skeleton variant="text" sx={styles.text} />
          <Skeleton variant="text" sx={styles.text} />
        </Box>
        <Box sx={styles.cardRow}>
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
          <Skeleton variant="rounded" sx={styles.card} />
        </Box>
      </Grid>
    </Container>
  );
}

export default Skelethon;
