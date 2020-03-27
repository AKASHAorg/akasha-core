import * as React from 'react';
import { useBoxProfile } from '../state';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';

const { BoxFormCard, Box } = DS;

const MyBoxProfile: React.FC<any> = ({ sdkModules, channelUtils }) => {
  const [state, actions] = useBoxProfile(sdkModules, channelUtils);
  const [errors, setErrors] = React.useState<any>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { observable } = await actions.fetchCurrent();
      observable.subscribe(
        () => {},
        (err: any) => {
          setErrors(new Error(err));
        },
      );
    };
    fetchUser();
  }, []);

  const onFormSubmit = (data: any) => {
    console.log('please submit my form data:', data);
  };
  if (errors && errors instanceof Error) {
    return (
      <Box
        fill={true}
        flex={true}
        pad={{ top: '1em' }}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <div>:((</div>
        <div>{errors.message}</div>
      </Box>
    );
  }
  return (
    <Box fill={true} flex={true} pad={{ top: '1em' }}>
      <BoxFormCard
        titleLabel={t('Ethereum Address')}
        avatarLabel={t('Avatar')}
        nameLabel={t('Name')}
        coverImageLabel={t('Cover Image')}
        descriptionLabel={t('Description')}
        uploadLabel={t('')}
        urlLabel={t('By url')}
        cancelLabel={t('Cancel')}
        saveLabel={t('Save')}
        deleteLabel={t('Delete')}
        nameFieldPlaceholder={t('Type your name here')}
        descriptionFieldPlaceholder={t('Add a description about you here')}
        ethAddress={state.data.ethAddress || ''}
        providerData={{
          providerName: '3Box',
          avatar: state.data.profileData.image,
          coverImage: state.data.profileData.coverPhoto,
          name: state.data.profileData.name,
          description: state.data.profileData.description,
        }}
        handleSubmit={onFormSubmit}
      />
    </Box>
  );
};

export default MyBoxProfile;
