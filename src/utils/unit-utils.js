import { formatEther } from '@ethersproject/units';

export const getFormattedEther = (wei) => {
    const ether = formatEther(wei);
    const temp = ether.split('.');
    return `${temp[0]}.${temp[1].substr(0,4)}`;
}