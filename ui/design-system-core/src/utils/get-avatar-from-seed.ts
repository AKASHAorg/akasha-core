export const getAvatarFromSeed = (seed: string | null) => {
  let str = seed;
  if (seed && seed.startsWith('0x')) {
    str = seed.replace('0x', '');
  }
  if (str && str.length) {
    const avatarOption = Array.from(str).reduce((sum: number, letter: string) => {
      if (parseInt(letter, 10)) {
        return sum + parseInt(letter, 10);
      }
      return sum;
    }, 0);
    // if user is a visitor his address is 0x0000... so sum is 0
    // so you can give him a specific placeholder (for now placeholder_7)
    if (avatarOption === 0) {
      return 7;
    }
    return (avatarOption % 6) + 1;
  }
  // load the first placeholder, just to not throw and error
  return 7;
};
