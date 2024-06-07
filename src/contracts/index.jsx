/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
import { rpc } from "../connectors/address";
import { ethers } from "ethers";
import ABI from "./abi/abi.json";
import { getGlobalState, setGlobalState } from "../hook/globalState";
import { updateSpotData, setSpotsCount } from "../hook/useGrid";

export const CONTRACT_ADDRESS = "0xe45610E578d4eb626121f55A61aB346A619B7d99";
const staticProvider = new ethers.providers.JsonRpcBatchProvider(
  "https://eth-rpc-api.thetatoken.org/rpc"
);

function getSignedContract() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const signer = provider.getSigner();
  if (signer != null) {
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
  }
  throw new Error("Not connected");
}

const EVENT_ABI =
  "ThetaMillionPublish(uint256,address,uint8,uint8,uint8,uint8,string,string,string,bool)";
const ABI_DECODE = [
  "uint8",
  "uint8",
  "uint8",
  "uint8",
  "string",
  "string",
  "string",
  "bool",
];

function waitForEvent() {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const signer = provider.getSigner();
  if (signer != null) {
    return new Promise(async (resolve) => {
      const filter = {
        address: CONTRACT_ADDRESS,
        topics: [ethers.utils.id(EVENT_ABI)],
      };
      const currentHeight = await staticProvider.getBlockNumber();
      staticProvider.on(filter, (log) => {
        // executed if event gets caught example loading ends
        const [tokenId] = ethers.utils.defaultAbiCoder.decode(
          ["uint256"],
          log.topics[1]
        );
        const [owner] = ethers.utils.defaultAbiCoder.decode(
          ["address"],
          log.topics[2]
        );
        const [x, y, width, height, title, image, link, updated] =
          ethers.utils.defaultAbiCoder.decode(ABI_DECODE, log.data);
        const spot = {
          x,
          y,
          width,
          height,
          title,
          image,
          link,
          owner,
          _index: tokenId.toNumber(),
        };
        updateSpotData(spot);
        if (
          owner.toLowerCase() === signer.getAddress().toLowerCase() &&
          log.blockNumber >= currentHeight
        ) {
          staticProvider.off(filter);
          resolve();
        }
      });
    });
  }
  return;
}

const contractInteraction = {
  buySpot: async (spot, value) => {
    try {
      const contract = getSignedContract();
      await contract.buySpot(
        spot.x,
        spot.y,
        spot.width,
        spot.height,
        spot.title,
        spot.image,
        spot.link,
        { value }
      );
      await waitForEvent();
    } catch (error) {
      console.log("Error", error);
    }
  },
  updateSpot: async (spot) => {
    try {
      const contract = getSignedContract();
      await contract.updateSpot(spot._index, spot.title, spot.image, spot.link);
    } catch (error) {
      console.log("Error", error);
    }
  },
  gatherSpots: async () => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, staticProvider);
    const spotsLength = 571; // (await contract.getSpotsLength() as BigNumber).toNumber();
    setSpotsCount(spotsLength);
    // load the data in parallel
    let doneCount = 0;
    for (let i = 0; i < spotsLength; i += 1) {
      if (i % 50 === 0 && i !== 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        (async (i) => {
          const spotWithOwner = await contract.getSpot(i);
          updateSpotData({
            x: spotWithOwner.spot.x,
            y: spotWithOwner.spot.y,
            width: spotWithOwner.spot.width,
            height: spotWithOwner.spot.height,
            title: spotWithOwner.spot.title,
            image: spotWithOwner.spot.image,
            link: spotWithOwner.spot.link,
            owner: spotWithOwner.owner,
            _index: i,
          });
          doneCount += 1;
          if (doneCount === spotsLength) {
            const info = getGlobalState("info");
            setGlobalState("info", { ...info, isGridLoading: false });
          }
      })(i);
    }
  },

  withdraw: async () => {
    const contract = getSignedContract();
    contract.withdraw();
  },
};

export default contractInteraction;
