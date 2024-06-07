export function shortenAddress(address) {
  const first = address.substring(0, 8);
  const last = address.substring(address.length - 5, address.length);

  return `${first}...${last}`;
}

export function getImageUrl(uri) {
  if (uri.includes("ipfs://")) {
    let url = uri;
    const newUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
    return newUrl;
  } else {
    return uri;
  }
}

export function getSocialUrl(social, input) {
  const urlParts = input.split("/");
  const username = urlParts[urlParts.length - 1];
  if (!username) {
    return null;
  }

  return `https://${social}/${username.replace("@", "")}`;

  // // Check if input is already a complete Twitter URL
  // if (input.includes(social)) {
  //   // Split the URL by '/'
  //   const urlParts = input.split("/");
  //   // The username is the last part of the URL
  //   const username = urlParts[urlParts.length - 1];
  //   if (!username) {
  //     return null;
  //   }
  //   return `https://twitter.com/${username}`;
  // }
  // // Check if input is a sub-URL or username
  // else {
  //   const inputParts = input.split("@");
  //   // The username is the last part of the input
  //   const username = inputParts[inputParts.length - 1];
  //   if (!username) {
  //     return null;
  //   }
  //   return `https://twitter.com/${username}`;
  // }
}
