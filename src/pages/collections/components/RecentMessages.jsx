import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import avatarImage from "../../../assets/default-user.jpg";

function RecentMessages({ messages }) {
  const [recentMessages, setRecentMessages] = useState(messages);
  const discussions = useSelector(
    (state) => state.discussion.selectedCollectionDiscussions
  );

  useEffect(() => {
    if (discussions.length > 0) {
      setRecentMessages(discussions.slice(-3));
    }
  }, [discussions]);

  return (
    <Box sx={styles.container}>
      {recentMessages &&
        recentMessages.map((message) => (
          <Box key={message._id} sx={styles.messageRow}>
            <Box sx={styles.avatar}>
              {message.user && (
                <img
                  src={
                    message.user.avatarImage
                      ? process.env.REACT_APP_API_URL + message.user.avatarImage
                      : avatarImage
                  }
                  alt="collection-avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              {!message.user && (
                <img
                  src={avatarImage}
                  alt="collection-avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>
            <Box sx={styles.textCol}>
              <Box sx={styles.name}>
                {(message.user && message.user.title) || message.senderAddress}
              </Box>
              <Box sx={styles.message}>
                {message.message.length > 80
                  ? message.message.slice(0, 50) + "..."
                  : message.message}
              </Box>
            </Box>
          </Box>
        ))}
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "1rem",
    width: "100%",
    height: "100%",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "1rem",
    backgroundColor: "transparent",
    border: "1px solid #6C6C6C",
    borderRadius: "1rem",
  },
  messageRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#6C6C6C",
  },
  textCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  name: {
    fontSize: "0.938rem",
    fontWeight: "600",
    color: "#F78C09",
  },
  clipBordIcon: {
    fontSize: "0.938rem",
    color: "#6C6C6C",
  },
  message: {
    fontSize: "0.938rem",
    fontWeight: "400",
    color: "#F4F4F4",
  },
};

export default RecentMessages;
