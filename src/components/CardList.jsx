import { Box } from "@mui/material";
import React, { Fragment } from "react";
import { CollectionCard } from "../pages/collections/components/collection-card";
import { styled } from "@mui/system";

function CardList({ list, view }) {
  return (
    <Fragment>
      <CollectionCardContainer>
        {view !== 1 &&
          list.length > 0 &&
          list.map((collectionItem, index) => {
            return (
              <CollectionCard
                key={`index_${index}`}
                collectionItem={collectionItem}
                where=""
              />
            );
          })}
      </CollectionCardContainer>
    </Fragment>
  );
}

const CollectionCardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  marginBottom: "20px",
}));

export default CardList;
