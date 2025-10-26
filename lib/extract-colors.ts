import sharp from 'sharp';
import path from 'path';

interface ColorPalette {
  primary: { main: string; light: string; dark: string };
  secondary: { main: string; light: string; dark: string };
  tertiary: { main: string; light: string; dark: string };
}

/**
 * Convert RGB to Hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert Hex to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to Hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const rHex = Math.round((r + m) * 255);
  const gHex = Math.round((g + m) * 255);
  const bHex = Math.round((b + m) * 255);

  return rgbToHex(rHex, gHex, bHex);
}

/**
 * Generate light and dark variations of a color
 */
function generateColorVariations(hex: string): { main: string; light: string; dark: string } {
  const hsl = hexToHSL(hex);

  // Light: increase lightness by 20%
  const lightL = Math.min(hsl.l + 20, 95);
  const light = hslToHex(hsl.h, hsl.s, lightL);

  // Dark: decrease lightness by 20%
  const darkL = Math.max(hsl.l - 20, 10);
  const dark = hslToHex(hsl.h, hsl.s, darkL);

  return { main: hex, light, dark };
}

/**
 * Extract dominant colors from favicon
 */
export async function extractColorsFromFavicon(): Promise<ColorPalette> {
  const faviconPath = path.join(process.cwd(), 'docs', 'exemplos', 'favicon.png');

  try {
    // Read and process the image
    const image = sharp(faviconPath);
    const { data, info } = await image
      .resize(50, 50) // Resize for faster processing
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Count color frequencies
    const colorMap = new Map<string, number>();

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = info.channels === 4 ? data[i + 3] : 255;

      // Skip transparent or near-white/black pixels
      if (a < 128 || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) {
        continue;
      }

      const hex = rgbToHex(r, g, b);
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    // Sort by frequency and get top 3 colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
      .slice(0, 3);

    // Assign colors based on hue (green -> primary, blue -> secondary, gray -> tertiary)
    const colorsByHue = sortedColors.map(hex => {
      const hsl = hexToHSL(hex);
      return { hex, hue: hsl.h, saturation: hsl.s };
    });

    // Find green (primary): hue 80-160
    const green = colorsByHue.find(c => c.hue >= 80 && c.hue <= 160) || colorsByHue[0];
    // Find blue (secondary): hue 180-260
    const blue = colorsByHue.find(c => c.hue >= 180 && c.hue <= 260) || colorsByHue[1];
    // Find gray (tertiary): low saturation
    const gray = colorsByHue.find(c => c.saturation < 20) || colorsByHue[2];

    return {
      primary: generateColorVariations(green.hex),
      secondary: generateColorVariations(blue.hex),
      tertiary: generateColorVariations(gray.hex),
    };
  } catch (error) {
    console.error('Error extracting colors from favicon:', error);

    // Fallback colors if extraction fails
    return {
      primary: generateColorVariations('#10b981'), // Green
      secondary: generateColorVariations('#1e40af'), // Blue
      tertiary: generateColorVariations('#6b7280'), // Gray
    };
  }
}

/**
 * Generate CSS variables string
 */
export function generateCSSVariables(palette: ColorPalette): string {
  return `
  /* Primary Colors (Green - Technology) */
  --color-primary: ${palette.primary.main};
  --color-primary-light: ${palette.primary.light};
  --color-primary-dark: ${palette.primary.dark};

  /* Secondary Colors (Blue - Corporate) */
  --color-secondary: ${palette.secondary.main};
  --color-secondary-light: ${palette.secondary.light};
  --color-secondary-dark: ${palette.secondary.dark};

  /* Tertiary Colors (Gray - Neutral) */
  --color-tertiary: ${palette.tertiary.main};
  --color-tertiary-light: ${palette.tertiary.light};
  --color-tertiary-dark: ${palette.tertiary.dark};

  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
`;
}
