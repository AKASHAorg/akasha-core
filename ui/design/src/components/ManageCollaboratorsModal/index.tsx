import React from 'react';
import { Box, Text, Image } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import { IProfileData } from '@akashaorg/typings/ui';

import Collaborator from './collaborator';

import Icon from '../Icon';
import { ISearchBar, SearchBar } from '../SearchBar';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledDrop } from '../EntryCard/styled-entry-box';
import { StyledBox, ModalWrapper, StyledModalBox } from '../ListModal/styled-modal';
import { useViewportSize } from '../Providers/viewport-dimension';

export interface IManageCollaboratorsModalProps
  extends Omit<ISearchBar, 'searchInputSize' | 'iconSize'> {
  className?: string;
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  collaborators: IProfileData[];
  searchResults: IProfileData[];
  noCollaboratorsLabel: string;
  noSearchItemsLabel: string;
  dropOpen: boolean;
  addButtonLabel: string;
  removeButtonLabel: string;
  closeModal: () => void;
  onClickCollaborator: (pubKey: string, action: 'add' | 'remove') => () => void;
  closeDrop: () => void;
}

const ManageCollaboratorsModal: React.FC<IManageCollaboratorsModalProps> = props => {
  const {
    className,
    assetName = 'no-collaborators',
    publicImgPath = '/images',
    titleLabel,
    inputValue,
    inputPlaceholderLabel,
    collaborators,
    searchResults,
    noCollaboratorsLabel,
    noSearchItemsLabel,
    dropOpen,
    addButtonLabel,
    removeButtonLabel,
    onInputChange,
    onSearch,
    closeModal,
    onClickCollaborator,
    closeDrop,
  } = props;

  const searchBarRef = React.useRef();

  const {
    dimensions: { width },
  } = useViewportSize();

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} justify="center" align="center">
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
        <MainAreaCardBox className={className}>
          <Box
            direction="row"
            margin={{ top: 'xsmall' }}
            align="start"
            pad={{ horizontal: 'medium', top: 'small' }}
            border={{ side: 'bottom', color: 'border' }}
          >
            {isMobileOnly && (
              <Icon type="arrowLeft" color="secondaryText" clickable={true} onClick={closeModal} />
            )}
            <Text weight={600} margin={{ bottom: '1rem', horizontal: 'auto' }} size="xlarge">
              {titleLabel}
            </Text>
            {!isMobileOnly && (
              <Icon type="close" color="secondaryText" clickable={true} onClick={closeModal} />
            )}
          </Box>
          <StyledModalBox pad="medium" gap="medium">
            <Box ref={searchBarRef}>
              <SearchBar
                inputValue={inputValue}
                inputPlaceholderLabel={inputPlaceholderLabel}
                onInputChange={onInputChange}
                onSearch={onSearch}
                searchInputSize="large"
                iconSize="sm"
              />
            </Box>
            {searchBarRef.current && dropOpen && (
              <StyledDrop
                align={{ top: 'bottom', left: 'left' }}
                target={searchBarRef.current}
                elevation="medium"
                style={{ zIndex: 200 }}
                onClickOutside={closeDrop}
                onEsc={closeDrop}
              >
                <Box fill="horizontal" pad="medium" gap="medium">
                  {!searchResults.length && <Text>{noSearchItemsLabel}</Text>}
                  {!!searchResults.length &&
                    searchResults.map((r, id) => (
                      <Collaborator
                        key={r.name + id}
                        value={r}
                        buttonLabel={addButtonLabel}
                        onClick={onClickCollaborator(r.pubKey, 'add')}
                      />
                    ))}
                </Box>
              </StyledDrop>
            )}
            {!collaborators.length && (
              <Box fill="horizontal" gap="small">
                <Box height="15rem" width="15rem" alignSelf="center">
                  <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
                </Box>
                <Text size="large" textAlign="center">
                  {noCollaboratorsLabel}
                </Text>
              </Box>
            )}
            {!!collaborators.length && (
              <Box fill="horizontal" gap="medium">
                {collaborators.map((c, id) => (
                  <Collaborator
                    key={c.name + id}
                    value={c}
                    buttonLabel={removeButtonLabel}
                    isRed={true}
                    onClick={onClickCollaborator(c.pubKey, 'remove')}
                  />
                ))}
              </Box>
            )}
          </StyledModalBox>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

export default ManageCollaboratorsModal;
