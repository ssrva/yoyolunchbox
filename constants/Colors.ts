const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const background = "#FFFFFF"
const backgroundLight = "rgba(255, 170, 0, 0.08)"
const backgroundDark = "#D1D1D1"
const text = "#4F4946"
const textDark = "#000000"

const primaryLight = "#f8e4a5"
const primary = "#F2C94C"
const primaryDark = "#bf950e"
const secondaryLight = "#00A18D"
const secondary = "#4F4946"
const secondaryDark = "#003136"

export default {
  theme: {
    background,
    backgroundDark,
    backgroundLight,
    text,
    textDark,
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark
  },
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
