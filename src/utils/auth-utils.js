import { sign, verify } from "web3-token";

export const generateToken = async (library) => {
  const opts = {
    statement:
      "Welcome to Octoplace! I want to sign in and I accept Octoplace Terms of Service. This request will not trigger a blockchain transaction or cost any gas fees.",
    domain: "octoplace.io",
    exprire_in: "1h", // 1 hour
    expiration_time: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
  };

  try {
    const signer = await library?.getSigner();
    const newToken = await sign((message) => signer.signMessage(message), opts);

    return newToken;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const verifyToken = async (token) => {
  try {
    const { address } = await verify(token, {
      domain: "octoplace.io",
    });

    if (address) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};
