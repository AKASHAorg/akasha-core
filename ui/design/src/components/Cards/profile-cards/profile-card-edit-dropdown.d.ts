interface IProfileEditMenuProps {
  target: {};
  onClose: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
}
declare const ProfileEditMenuDropdown: (props: IProfileEditMenuProps) => JSX.Element;
export default ProfileEditMenuDropdown;
