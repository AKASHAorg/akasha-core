import * as React from 'react';
export interface IBasicCardBox {
  className?: string;
  callToAction?: boolean;
  dashedBorder?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}
declare const BasicCardBox: React.FC<IBasicCardBox>;
declare const MainAreaCardBox: import('styled-components').StyledComponent<
  React.FC<IBasicCardBox>,
  any,
  {
    verticalFill?: boolean | undefined;
  },
  never
>;
declare const WidgetAreaCardBox: import('styled-components').StyledComponent<
  React.FC<IBasicCardBox>,
  any,
  {},
  never
>;
declare const ModalCard: import('styled-components').StyledComponent<
  React.FC<IBasicCardBox>,
  any,
  {},
  never
>;
export { BasicCardBox, MainAreaCardBox, WidgetAreaCardBox, ModalCard };
