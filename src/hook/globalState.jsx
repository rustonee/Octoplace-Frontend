import { createGlobalState } from "react-hooks-global-state";

const spots = [];
const grid = new Array(50);
for(let i = 0; i < 50; i++) {
    grid[i] = new Array(50);
}

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState({
    info: {
        grid,
        spots,
        receivedSpots: 0,
        totalSpots: -1, // no information yet
        pixelsUsed: 0,
        isGridLoading: true,
    },
    shownSpots: 0
})

export { useGlobalState, setGlobalState, getGlobalState }