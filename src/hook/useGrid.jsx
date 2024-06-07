/* eslint-disable no-unused-vars */
import { SPACE_WIDTH, fixedImages } from "../constants/nftMillions";
import { getGlobalState, setGlobalState, useGlobalState } from "./globalState";

export function setSpotsCount(spotCount) {
    const info = getGlobalState('info');
    setGlobalState('info', { ...info, totalSpots: spotCount });
}

export const updateSpotData = (spot) => {
    let { spots, grid, receivedSpots, pixelsUsed, totalSpots, isGridLoading } = getGlobalState('info');
    if(!spots[spot._index]) {
        receivedSpots += 1;
        pixelsUsed += (spot.height * spot.width) * (SPACE_WIDTH * SPACE_WIDTH);
        if (receivedSpots > totalSpots) {
            totalSpots = receivedSpots;
        }
    }
    // Some users mixed up https:// or something similar
    // In case the intention was clear, I fixed these images
    if(fixedImages[spot.image]) {
        spot.image = fixedImages[spot.image];
    }
    if(spot.link.slice(0, 10) === '//https://') { // fixes some bad links
        spot.link = spot.link.slice(2);
    }

    spots[spot._index] = spot;
    for(let i = 0; i < spot.width; i += 1) {
        for(let k = 0; k < spot.height; k += 1) {
            grid[spot.x+i][spot.y+k] = true;
        }
    }

    setGlobalState('info', { spots: [...spots], grid, receivedSpots, pixelsUsed, totalSpots, isGridLoading });
}

export default function useGrid() {
    const [info, setInfo] = useGlobalState('info');

    // should later listend to blockchain and auto-download

    return info;
}