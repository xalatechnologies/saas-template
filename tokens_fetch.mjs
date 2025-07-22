import fetch from 'node-fetch';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

// Configuration: Upstream token sources
const sources = [
  {
    name: 'digdir',
    url: 'https://cdn.jsdelivr.net/npm/@digdir/design-system-tokens@latest/brand/digdir/tokens.css'
  },
  // Note: NSM tokens URL was returning 404, removed until correct URL is found
  // {
  //   name: 'nsm',
  //   url: 'https://cdn.jsdelivr.net/npm/@digdir/designsystemet-theme@latest/portal/tokens.css'
  // }
];

// Fetch raw CSS and extract all --fds-<name>: <value>; declarations into a flat object
async function fetchTokens(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const css = await res.text();
  const regex = /--fds-([\w-]+):\s*([^;]+);/g;
  const out = {};
  for (const [, key, val] of css.matchAll(regex)) {
    out[key] = val.trim();
  }
  return out;
}

// Group merged tokens into categories: colors, typography, spacing, borderRadius, shadows
function groupTokens(all) {
  const colorScales = {};
  const baseColors = { white: '#ffffff', black: '#000000', transparent: 'transparent' };
  const typography = { fontFamily: {}, fontSize: {}, fontWeight: {}, lineHeight: {}, letterSpacing: {} };
  const spacing = {};
  const borderRadius = {};
  const shadows = {};

  const semanticScales = ['gray', 'success', 'error', 'warning', 'info'];

  for (const [name, value] of Object.entries(all)) {
    const parts = name.split('-');

    // Colors
    if (parts[0] === 'color') {
      // Semantic scales e.g. color-gray-50
      if (parts.length === 3 && semanticScales.includes(parts[1])) {
        const [_, scale, shade] = parts;
        colorScales[scale] = colorScales[scale] || {};
        colorScales[scale][shade] = value;

      // Base colors e.g. color-white
      } else if (parts.length === 2) {
        const key = parts[1];
        if (['white', 'black', 'transparent'].includes(key)) {
          baseColors[key] = value;
        }
      }

    // Spacing
    } else if (parts[0] === 'spacing') {
      const key = parts[1];
      spacing[key] = value;

    // Border radii
    } else if (parts[0] === 'border' && parts[1] === 'radius') {
      const key = parts[2];
      borderRadius[key] = value;

    // Shadows
    } else if (parts[0] === 'shadow') {
      const key = parts[1];
      shadows[key] = value;

    // Typography: font-family, font-size, font-weight
    } else if (parts[0] === 'font') {
      if (parts[1] === 'family') {
        const family = parts[2];
        typography.fontFamily[family] = value.split(/,\s*/);
      } else if (parts[1] === 'size') {
        const key = parts[2];
        typography.fontSize[key] = value;
      } else if (parts[1] === 'weight') {
        const key = parts[2];
        typography.fontWeight[key] = value;
      }

    // Line height
    } else if (parts[0] === 'line' && parts[1] === 'height') {
      const key = parts[2];
      typography.lineHeight[key] = value;

    // Letter spacing
    } else if (parts[0] === 'letter' && parts[1] === 'spacing') {
      const key = parts[2];
      typography.letterSpacing[key] = value;
    }
  }

  return { colorScales, baseColors, typography, spacing, borderRadius, shadows };
}

(async () => {
  console.log('🔄 Fetching and merging tokens…');
  const merged = {};
  let fetchedTotal = 0, overridden = 0;

  // Fetch & merge (NSM overrides Digdir)
  for (const { name, url } of sources) {
    try {
      const tokens = await fetchTokens(url);
      console.log(`• ${name} → ${Object.keys(tokens).length} tokens`);
      fetchedTotal += Object.keys(tokens).length;
      for (const [k, v] of Object.entries(tokens)) {
        if (merged[k] && name === 'nsm') overridden++;
        merged[k] = v;
      }
    } catch (error) {
      console.error(`⚠️ Failed to fetch tokens from ${name}: ${error.message}`);
      console.log(`• ${name} → 0 tokens (skipped due to error)`);
    }
  }

  console.log(`Total fetched: ${fetchedTotal}`);
  console.log(`Total overridden by NSM: ${overridden}`);
  console.log(`Final token count: ${Object.keys(merged).length}`);

  // Group into categories
  const { colorScales, baseColors, typography, spacing, borderRadius, shadows } = groupTokens(merged);

  // Ensure output directory - write to a temporary directory to avoid overwriting existing tokens
  const outDir = path.resolve(process.cwd(), 'generated-tokens');
  mkdirSync(outDir, { recursive: true });
  
  console.log('\n⚠️ Warning: The generated tokens are incomplete compared to your existing tokens.');
  console.log('Writing tokens to ./generated-tokens instead of overwriting your existing tokens.\n');

  // 1) colors.ts
  // Define grayScale if it exists in the colorScales
  const hasGrayScale = colorScales.gray !== undefined;
  
  const colorFile = `import type { BaseColors, ColorScale } from '../types';

// Semantic color scales
${Object.entries(colorScales)
    .map(([scale, map]) =>
      `export const ${scale}Scale: ColorScale = ${JSON.stringify(map, null, 2)};`
    )
    .join('\n\n')}

// Base colors
export const baseColors: BaseColors = {
  white: '${baseColors.white}',
  black: '${baseColors.black}',
  transparent: '${baseColors.transparent}'${hasGrayScale ? ',\n  gray: grayScale' : ''}
};

// NOTE: These tokens are incomplete. Consider merging with your existing tokens.
`;
  writeFileSync(path.join(outDir, 'colors.ts'), colorFile);
  console.log('→ base/colors.ts generated');

  // 2) typography.ts
  const typFile = `import type { Typography } from '../types';

export const typography: Typography = ${JSON.stringify(typography, null, 2)};

// NOTE: These tokens are incomplete. Consider merging with your existing tokens.
`;
  writeFileSync(path.join(outDir, 'typography.ts'), typFile);
  console.log('→ base/typography.ts generated');

  // 3) spacing.ts
  const spaceFile = `import type { Spacing, BorderRadius, Shadows } from '../types';

export const spacing: Spacing = ${JSON.stringify(spacing, null, 2)};

export const borderRadius: BorderRadius = ${JSON.stringify(borderRadius, null, 2)};

export const shadows: Shadows = ${JSON.stringify(shadows, null, 2)};

// NOTE: These tokens are incomplete. Consider merging with your existing tokens.
`;
  writeFileSync(path.join(outDir, 'spacing.ts'), spaceFile);
  console.log('→ base/spacing.ts generated');

})();
