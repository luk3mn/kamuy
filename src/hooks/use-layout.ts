import { PixelRatio, useWindowDimensions } from "react-native";

/** Largura lógica do frame no Paper (iPhone 14/15). */
const DESIGN_WIDTH = 390;
const MIN_FACTOR = 0.88;
const MAX_FACTOR = 1.2;

function scale(size: number, width: number) {
  const factor = Math.min(
    MAX_FACTOR,
    Math.max(MIN_FACTOR, width / DESIGN_WIDTH)
  );
  return PixelRatio.roundToNearestPixel(size * factor);
}

export function useLayout() {
  const { width } = useWindowDimensions();

  return {
    image: {
      avatar: scale(56, width),
    },
    icon: {
      xs: scale(14, width),
      sm: scale(18, width),
      md: scale(22, width),
      lg: scale(28, width),
      xl: scale(36, width),
      xxl: scale(44, width),
    },
    hit: {
      sm: scale(28, width),
    },
    social: scale(44, width),
    fab: scale(56, width),
    gap: scale(8, width),
    padding: {
      top: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      bottom: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      left: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      right: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
    },
    margin: {
      top: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      bottom: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      left: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
      right: {
        xs: scale(4, width),
        sm: scale(8, width),
        md: scale(12, width),
        lg: scale(16, width),
        xl: scale(20, width),
        xxl: scale(24, width),
        xxxl: scale(28, width),
        xxxxl: scale(32, width),
        xxxxxl: scale(36, width),
      },
    }
  };
}