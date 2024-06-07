import axios from "axios";

const registerOrFetchUserSetting = async (token, address, network) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const result = await axios.post(
      `${apiUrl}/users/register`,
      {
        // address: address,
        network: network,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return result.data;
  } catch (error) {
    // Handle error here, e.g. show an error message
    console.log("Error fetching user setting:", error);
    throw new Error("Failed to fetch user setting");
  }
};

const updateUserSetting = async (token, userObj) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const result = await axios.post(
      `${apiUrl}/users/update`,
      {
        user: userObj,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return result.data;
  } catch (error) {
    // Handle error here, e.g. show an error message
    console.log("Error updating user setting:", error);
    throw new Error("Failed to update user setting");
  }
};

const updateUserTopNFT = async (token, nftObj) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const result = await axios.post(
      `${apiUrl}/users/update-top-nft`,
      {
        topNFT: nftObj,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    return result.data;
  } catch (error) {
    // Handle error here, e.g. show an error message
    console.log("Error updating user setting:", error);
    throw new Error("Failed to update user setting");
  }
};

const fetchUserSetting = async (address) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const result = await axios.get(
      `${apiUrl}/users/find/${address}?${Date.now()}`
    );
    return result.data;
  } catch (error) {
    console.log("Error getting user setting:", error);
  }

  return null;
};

const fetchUserTopNFTs = async (address) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const result = await axios.get(
      `${apiUrl}/users/find-top-nft/${address}?${Date.now()}`
    );
    return result.data;
  } catch (error) {
    // Handle error here, e.g. show an error message
    console.log("Error getting user setting:", error);
    throw new Error("Failed to fetch user setting");
  }
};

// logging

const loggingWalletConnect = async (address) => {
  const apiUrl = process.env.REACT_APP_LOGGING_API_URL;
  try {
    const result = await axios.post(
      `${apiUrl}/api/wallet/wallet-connection/${address}`
    );
    return result.data;
  } catch (error) {
    console.log("Error logging wallet connection:", error);
  }
};

const loggingUserRegistration = async (address) => {
  const apiUrl = process.env.REACT_APP_LOGGING_API_URL;
  try {
    const result = await axios.post(
      `${apiUrl}/api/wallet/octo-user-registration/${address}`
    );
    console.log("logging", result.data);
    return result.data;
  } catch (error) {
    console.log("Error logging user registration:", error);
  }
};

export {
  registerOrFetchUserSetting,
  updateUserSetting,
  updateUserTopNFT,
  fetchUserSetting,
  fetchUserTopNFTs,
  loggingWalletConnect,
  loggingUserRegistration,
};
