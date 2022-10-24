
export const getDeltaVoteValue = (oldValue: number, newValue: number) => {
    if (oldValue === newValue) return 0;
    if (oldValue === 0) return newValue;
    if (oldValue === -1) return 2;
    return -2;
}