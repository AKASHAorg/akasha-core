import routes, { TOS, TOU, PP, COC, DG } from '../routes';

export type LegalOption =
  | 'Terms of Service'
  | 'Terms of Use'
  | 'Privacy Policy'
  | 'Code of Conduct'
  | 'Developer Guidelines';

export interface ILegalItem {
  label: LegalOption;
  route: string;
}

export const legalItems: ILegalItem[] = [
  {
    label: TOS,
    route: routes[TOS],
  },
  {
    label: TOU,
    route: routes[TOU],
  },
  {
    label: PP,
    route: routes[PP],
  },
  {
    label: COC,
    route: routes[COC],
  },
  {
    label: DG,
    route: routes[DG],
  },
];
