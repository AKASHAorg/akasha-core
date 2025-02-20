/**
 * Utility function to generate avatar placeholders from seed (could be ETH address or DID etc).
 * Helpful for when avatar is null or undefined
 * @param seed - string or null
 * @returns placeholder image number
 */
export const getImageFromSeed = (seed: string | null, numberOfPlaceholders: number) => {
  let str = seed;

  if (seed && seed.search('0x') != -1) {
    str = seed.replace('0x', '');
  }

  if (str && str.length) {
    const avatarOption = Array.from(str).reduce((sum: number, letter: string) => {
      if (parseInt(letter, 10)) {
        return sum + parseInt(letter, 10);
      }
      return sum;
    }, 0);

    /**
     * if user is a visitor his address is 0x0000... so sum is 0
     * you can give him a specific placeholder
     */
    if (avatarOption === 0) {
      return numberOfPlaceholders;
    }

    return (avatarOption % (numberOfPlaceholders - 1)) + 1;
  }
  // load the first placeholder, just to not throw and error
  return numberOfPlaceholders;
};
