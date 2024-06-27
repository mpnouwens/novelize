const tintColorLight = "#01B3FF";
const tintColorDark = "#01B3FF";

const inactiveColor = "#9BA1A6";

const grayColorDark = "#1B1B1B";
const grayColorLight = "#F7F7F7";

export enum colorSlugs {
  text = "text",
  background = "background",
  tint = "tint",
  icon = "icon",
  innactive = "innactive",
  tabIconDefault = "tabIconDefault",
  tabIconSelected = "tabIconSelected",
  emptyBackground = "emptyBackground",
}

export const GenericColors = {
  white: "#ffffff",
  black: "#000000",
  blue: "#01B3FF",
  green: "#009D36",
  red: "#FF0000",
  yellow: "#FFB800",
  orange: "#FF6B00",
  purple: "#7000FF",
  pink: "#FF008A",
  grey: "#808080",
};

export const Colors = {
  light: {
    [colorSlugs.text]: "#000000",
    [colorSlugs.background]: "#ffffff",
    [colorSlugs.tint]: tintColorLight,
    [colorSlugs.icon]: "#687076",
    [colorSlugs.innactive]: inactiveColor,
    [colorSlugs.tabIconDefault]: "#687076",
    [colorSlugs.tabIconSelected]: tintColorLight,
    [colorSlugs.emptyBackground]: grayColorLight,
  },
  dark: {
    [colorSlugs.text]: "#ffffff",
    [colorSlugs.background]: "#000000",
    [colorSlugs.tint]: tintColorDark,
    [colorSlugs.innactive]: inactiveColor,
    [colorSlugs.icon]: "#9BA1A6",
    [colorSlugs.tabIconDefault]: "#9BA1A6",
    [colorSlugs.tabIconSelected]: tintColorDark,
    [colorSlugs.emptyBackground]: grayColorDark,
  },
};
