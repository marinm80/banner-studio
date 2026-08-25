// Fonts available in the editor. Google fonts are loaded on demand with a
// <link>; web-safe ones need no loading at all.
export const FONTS = [
  { family: 'Inter', google: true },
  { family: 'Roboto', google: true },
  { family: 'Montserrat', google: true },
  { family: 'Poppins', google: true },
  { family: 'Oswald', google: true },
  { family: 'Raleway', google: true },
  { family: 'Lato', google: true },
  { family: 'Nunito', google: true },
  { family: 'Bebas Neue', google: true, weights: '400' },
  { family: 'Orbitron', google: true },
  { family: 'JetBrains Mono', google: true },
  { family: 'Fira Code', google: true },
  { family: 'Space Mono', google: true },
  { family: 'Playfair Display', google: true },
  { family: 'Merriweather', google: true },
  { family: 'Arial', google: false },
  { family: 'Georgia', google: false },
  { family: 'Courier New', google: false },
];

let injected = false;

export function injectGoogleFonts() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const families = FONTS.filter((f) => f.google)
    .map((f) => `family=${f.family.replace(/ /g, '+')}:wght@${f.weights || '400;700'}`)
    .join('&');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

// Before drawing on the canvas every font in use must be loaded, otherwise the
// browser silently falls back to a default face and the export won't match.
export async function waitForLayerFonts(layers) {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = layers
    .filter((l) => l.type === 'text')
    .map((l) =>
      document.fonts.load(`${l.weight} ${l.size}px "${l.font}"`, l.text).catch(() => {})
    );
  await Promise.all(loads);
}
