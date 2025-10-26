import { extractColorsFromFavicon, generateCSSVariables } from '../lib/extract-colors';
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  console.log('🎨 Extracting colors from favicon...');

  const palette = await extractColorsFromFavicon();

  console.log('\n✅ Colors extracted:');
  console.log('Primary (Green):', palette.primary);
  console.log('Secondary (Blue):', palette.secondary);
  console.log('Tertiary (Gray):', palette.tertiary);

  const cssVariables = generateCSSVariables(palette);

  // Save to a file for reference
  const outputPath = path.join(process.cwd(), 'lib', 'colors.json');
  await fs.writeFile(outputPath, JSON.stringify(palette, null, 2));

  console.log('\n💾 Colors saved to lib/colors.json');
  console.log('\n📋 CSS Variables to add to globals.css:');
  console.log(cssVariables);
}

main().catch(console.error);
