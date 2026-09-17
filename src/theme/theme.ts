import { getOverrideSystemColors } from '@nexpy/design-system'

const customDesignSystemColors = getOverrideSystemColors({
  systemPrimary: '#2957a4',
  systemDanger: '#D9534F',
  systemWarning: '#F0AD4E',
  systemSafe: '#6BB85C',

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
    grey200: '#d0d0d0',
    grey300: '#a7a9ac',
    grey500: '#626262',

    greenLight: '#A8D49F',

    unavailable: '#64616B',
    orange: '#F0AD4E',
    orange_darken: '#d48e2c',
    green: '#6BB85C',
    lightRed: '#FFE6E6',

    primaryLight: '#3f78d3',
    oldSilver: '#848484',
    oldSilverDarken: '#808080',
    aliceBlue: '#E5EAF4',
    denim: '#335FA9',

    scrollPrimary: '#2b2d79',
    scrollSecondary: '#224b92',
    honeydew: '#eafaf1',
    lavanderBlush: '#ffefed',
    almondSilk: '#f1ceca',
    PearlBeige: '#ffedc6',

    charcoal: '#53595f',

    twilightIndigo: '#32326d',
  },
}
