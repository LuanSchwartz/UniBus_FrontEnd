import { getOverrideSystemColors } from '@nexpy/design-system'

const customDesignSystemColors = getOverrideSystemColors({
  systemPrimary: '#2957a4',
  systemDanger: '#DC2626',
  systemWarning: '#d97706',
  systemSafe: '#047857',

  systemFocus: '#3878e0',
  systemDisabled: '#e5e5e5',

  systemText: '#1a2027',

  systemBlack: '#28262C',
  systemLightGrey: '#64616b',
  systemTranslucidBlack: 'rgba(0, 0, 0, 0.3)',
  systemWhite: '#fff',
})

export const customTheme = {
  colors: {
    ...customDesignSystemColors,

    primary: '#2957a4',
    primaryd: '#264f94',
    light: '#f9f9ff',
    black: '#28262c',
    grey: '#d0d0d0',

    loader: '#538ce8',

    primaryBackground: '#edf4ff',
    primaryTransparent: 'rgba(41, 87, 164, 0.2)',

    translucidBlackDarken: 'rgba(0, 0, 0, 0.4)',

    grey100: '#f2f2f2',
    grey150: '#e2e2e2',
    grey200: '#F8FAFC',
    grey300: '#a7a9ac',
    grey500: '#626262',

    prussianBlue: '#132A4D',
    blueSlate: '#475569',
    paleSlate: '#CBD5E1',

    whiteSmoke: '#F5F5F51A',

    ochre: '#d977062a',
    ivoryMist: '#FFFBEB',
    turfeGreen: '#ECFDF5',
    snow: '#FDF2F2',
    snow2: '#ffe0e0',
    aliceBlue: '#F0F6FF',
    aliceBlue2: '#dceaff',

    royalAzure: '#2F5FD8',
  },
}
