interface IThemeColor {
  name?: string;
  color?: string;
}

declare module '../assets/data/dummy.jsx' {
  const themeColors: /* type of themeColors */ IThemeColor[];
  export default themeColors;
}
