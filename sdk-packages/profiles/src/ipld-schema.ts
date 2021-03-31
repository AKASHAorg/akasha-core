const UserProfile = 'UserProfile';
const ProfileProvider = 'ProfileProvider';
const Tag = 'Tag';
const Image = 'Image';
const Entry = 'Entry';

export const UserProfileSchema = `

type ${ProfileProvider} {String: Link}
type Tags [String]
type ${UserProfile} struct {
 ethereumAddress String
 providers ProfileProvider
}
`;

export const types = {
  UserProfile,
  ProfileProvider,
  Tag,
  Image,
  Entry,
};
