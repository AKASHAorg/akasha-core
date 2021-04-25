import { Box, Text } from 'grommet';
import * as React from 'react';
import { IProfileDataProvider } from '../../ProfileCard';
import { StyledBox, StyledDrop, StyledListElem, StyledRadioButton } from './styled-select-popover';

export interface ISelectPopover {
  className?: string;
  onClickElem: (provider: IProfileDataProvider) => void;
  dataSource: IProfileDataProvider[];
  target: HTMLElement;
  closePopover: () => void;
  currentValue?: string;
}

const SelectPopover: React.FC<ISelectPopover> = props => {
  const { currentValue, className, closePopover, dataSource, onClickElem, target } = props;

  const handleClick = (provider: IProfileDataProvider) => () => {
    onClickElem(provider);
    setSelected(provider.value);
  };

  const [selected, setSelected] = React.useState(currentValue);

  return (
    <StyledDrop
      target={target}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
      className={className}
    >
      <Box direction="column">
        {dataSource &&
          dataSource.map((provider, index) => (
            <StyledListElem onClick={handleClick(provider)} key={index}>
              <Box margin={{ horizontal: 'small' }} direction="row" align="center" gap="small">
                <StyledRadioButton
                  name={provider.value}
                  checked={selected === provider.value}
                  label={`${provider.providerName}: `}
                  readOnly={true}
                />
                <StyledBox>
                  <Text size="medium">{provider.value}</Text>
                </StyledBox>
              </Box>
            </StyledListElem>
          ))}
      </Box>
    </StyledDrop>
  );
};

export { SelectPopover };
