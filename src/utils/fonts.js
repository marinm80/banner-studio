// Fonts available in the editor, and the one place that decides how a text
// layer turns into a CSS/canvas font string.
//
// `italic: true` means the family ships a real italic face on Google Fonts.
// For the rest the browser synthesises an oblique, which both the DOM preview
// and the canvas do, so the two still agree — but a real italic looks better,
// which is why the flag drives what gets requested from Google.
export const FONTS = [
  // Sans
  { family: 'Inter', google: true, italic: true },
  { family: 'Roboto', google: true, italic: true },
  { family: 'Montserrat', google: true, italic: true },
  { family: 'Poppins', google: true, italic: true },
  { family: 'Raleway', google: true, italic: true },
  { family: 'Lato', google: true, italic: true },
  { family: 'Nunito', google: true, italic: true },
  { family: 'Oswald', google: true, italic: false },
  { family: 'Bebas Neue', google: true, weights: '400', italic: false },
  { family: 'Orbitron', google: true, italic: false },

  // Serif — the ones with a genuine italic, which is what most people mean
  // when they ask for cursive on a name.
  { family: 'Playfair Display', google: true, italic: true, group: 'Serif' },
  { family: 'Merriweather', google: true, italic: true, group: 'Serif' },
  { family: 'Cormorant Garamond', google: true, italic: true, group: 'Serif' },
  { family: 'EB Garamond', google: true, italic: true, group: 'Serif' },
  { family: 'Libre Baskerville', google: true, italic: true, group: 'Serif' },

  // Script and handwriting. These are already slanted by design, so the italic
  // toggle adds little — they are here to be the cursive option themselves.
  { family: 'Dancing Script', google: true, weights: '400;700', italic: false, group: 'Script' },
  { family: 'Great Vibes', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Pacifico', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Satisfy', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Lobster', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Caveat', google: true, weights: '400;700', italic: false, group: 'Script' },
  // Signature-style hands, the ones that actually look written rather than
  // merely slanted. Single weight — these families ship only a 400.
  { family: 'Allura', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Sacramento', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Parisienne', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Marck Script', google: true, weights: '400', italic: false, group: 'Script' },
  { family: 'Homemade Apple', google: true, weights: '400', italic: false, group: 'Script' },

  // Monospace
  { family: 'JetBrains Mono', google: true, italic: true, group: 'Monospace' },
  { family: 'Space Mono', google: true, italic: true, group: 'Monospace' },
  { family: 'Fira Code', google: true, italic: false, group: 'Monospace' },

  // Always available, nothing to load
  { family: 'Arial', google: false, italic: true, group: 'System' },
  { family: 'Georgia', google: false, italic: true, group: 'System' },
  { family: 'Courier New', google: false, italic: true, group: 'System' },
];

export const FONT_BY_FAMILY = Object.fromEntries(FONTS.map((f) => [f.family, f]));

// Order the <select> groups the way the list above is written.
export const FONT_GROUPS = ['Sans', 'Serif', 'Script', 'Monospace', 'System'];

export const fontGroup = (f) => f.group || 'Sans';

// The single definition of a text layer's font, used by the DOM preview, the
// canvas renderer and the width measurement alike. They have to agree exactly:
// if the measurement says one thing and the export draws another, the download
// stops matching the editor and aligned text lands off its edge.
export function fontSpec(layer) {
  return `${layer.italic ? 'italic ' : ''}${layer.weight} ${layer.size}px "${layer.font}"`;
}

let injected = false;

export function injectGoogleFonts() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const families = FONTS.filter((f) => f.google)
    .map((f) => {
      const name = f.family.replace(/ /g, '+');
      const weights = (f.weights || '400;700').split(';');
      if (!f.italic) return `family=${name}:wght@${weights.join(';')}`;
      // css2 wants the axis tuples in ascending order: upright weights first,
      // then the italics.
      const tuples = [
        ...weights.map((w) => `0,${w}`),
        ...weights.map((w) => `1,${w}`),
      ];
      return `family=${name}:ital,wght@${tuples.join(';')}`;
    })
    .join('&');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

// Before drawing on the canvas every font in use must be loaded, otherwise the
// browser silently falls back to a default face and the export won't match.
// The spec includes the style, so an italic layer waits for the italic face
// rather than the upright one.
export async function waitForLayerFonts(layers) {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = layers
    .filter((l) => l.type === 'text')
    .map((l) => document.fonts.load(fontSpec(l), l.text).catch(() => {}));
  await Promise.all(loads);
}
