/**
 * Generates tenure info, given the status of the moderator
 * @param status - moderator status (active or resigned or revoked)
 * @returns string
 */
export const generateTenureInfoLabel = (status: 'active' | 'resigned' | 'revoked') => {
  if (status === 'active') return 'Moderator since';
  else return `${status[0].toUpperCase() + status.slice(1)} on`;
};
