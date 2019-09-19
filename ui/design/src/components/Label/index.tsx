import * as React from 'react';
import styledComponents, { css } from 'styled-components';

export interface ILabelProps {
  children?: React.ReactNode;
  label?: string;
  labelStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

export interface RootProps {
  withLabel?: boolean;
  wrapperStyle?: React.CSSProperties;
}

const Root = styledComponents.div<RootProps>`
  ${props => {
    const { withLabel } = props;

    if (withLabel) {
      return css`
        padding-top: 22px;
      `;
    }
  }};
  position: relative;
  margin: 22px 0;
`;

const Text = styledComponents.div<RootProps>`
  position: absolute;
  top: 0;
  text-transform: uppercase;
  font-size: 11px;
`;

const Label: React.FunctionComponent<ILabelProps> = ({
  children,
  label,
  wrapperStyle,
  labelStyle,
}) => (
  <Root withLabel={!!label} wrapperStyle={wrapperStyle}>
    {label && <Text style={labelStyle}>{label}</Text>}
    {children}
  </Root>
);

export default Label;
