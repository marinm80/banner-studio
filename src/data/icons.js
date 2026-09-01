// Built-in icon library. Every icon is the *inner* markup of a 64×64 viewBox so
// it can be scaled to any size and turned into a data URI for both the DOM
// preview and the canvas export.
//
// Icons written with `currentColor` are monochrome and can be tinted by the
// user; brand icons keep their official colors.

import TUX_PNG from '../features/backgrounds/tuxImage';

const FONT = 'Inter, Segoe UI, Arial, Helvetica, sans-serif';

const label = (txt, fg = '#ffffff', size = 22, y = 33) =>
  `<text x="32" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="central">${txt}</text>`;

const tile = (bg, inner) => `<rect width="64" height="64" rx="14" fill="${bg}"/>${inner}`;

// Rounded brand tile with a short monogram — used for logos whose real artwork
// is too intricate to stay readable at banner scale.
const mono = (bg, txt, fg = '#ffffff', size = 22) => tile(bg, label(txt, fg, size));

const shield = (bg, txt) =>
  `<path d="M8 4h48l-4.4 49L32 60 12.4 53z" fill="${bg}"/>` +
  `<path d="M32 8v48l16-4 3.6-44z" fill="#000000" fill-opacity="0.12"/>` +
  label(txt, '#ffffff', 26, 32);

/* ── Hand-drawn marks for the most recognizable logos ──────────────────── */

const PYTHON_HALF =
  'M32 2c-8 0-13 3.4-13 9v7h14v2H15C8 20 3 25 3 33s5 13 12 13h4v-8c0-7 6-12 13-12h12c6 0 9-4 9-9v-6c0-6-5-9-12-9H32z';

const python =
  `<path d="${PYTHON_HALF}" fill="#3776ab"/>` +
  `<g transform="rotate(180 32 32)"><path d="${PYTHON_HALF}" fill="#ffd43b"/></g>` +
  `<circle cx="26" cy="9" r="2.4" fill="#ffffff"/><circle cx="38" cy="55" r="2.4" fill="#ffffff"/>`;

const react =
  `<circle cx="32" cy="32" r="6" fill="#61dafb"/>` +
  ['0', '60', '120']
    .map(
      (a) =>
        `<ellipse cx="32" cy="32" rx="29" ry="11" fill="none" stroke="#61dafb" stroke-width="3" transform="rotate(${a} 32 32)"/>`
    )
    .join('');

const nodejs =
  `<path d="M32 3l25 14.5v29L32 61 7 46.5v-29z" fill="#539e43"/>` +
  label('JS', '#ffffff', 17, 33);

const git =
  `<rect x="10" y="10" width="44" height="44" rx="9" transform="rotate(45 32 32)" fill="#f05033"/>` +
  `<circle cx="25" cy="21" r="5" fill="#ffffff"/><circle cx="25" cy="43" r="5" fill="#ffffff"/>` +
  `<circle cx="41" cy="32" r="5" fill="#ffffff"/>` +
  `<path d="M25 26v12M28 24l9 6" stroke="#ffffff" stroke-width="3.5" fill="none"/>`;

const github =
  tile('#181717', '') +
  `<path d="M32 12c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.7 19 1 .2 1.4-.4 1.4-1v-3.5c-5.6 1.2-6.8-2.7-6.8-2.7-.9-2.3-2.2-2.9-2.2-2.9-1.8-1.3.1-1.2.1-1.2 2 .1 3.1 2.1 3.1 2.1 1.8 3.1 4.7 2.2 5.8 1.7.2-1.3.7-2.2 1.3-2.7-4.5-.5-9.2-2.2-9.2-9.9 0-2.2.8-4 2.1-5.4-.2-.5-.9-2.6.2-5.4 0 0 1.7-.5 5.5 2.1a19 19 0 0110 0c3.8-2.6 5.5-2.1 5.5-2.1 1.1 2.8.4 4.9.2 5.4 1.3 1.4 2.1 3.2 2.1 5.4 0 7.7-4.7 9.4-9.2 9.9.7.6 1.4 1.9 1.4 3.8v5.6c0 .6.4 1.2 1.4 1C46.3 48.3 52 40.8 52 32c0-11-9-20-20-20z" fill="#ffffff"/>`;

const docker =
  tile('#2496ed', '') +
  [
    [16, 34],
    [24, 34],
    [32, 34],
    [40, 34],
    [24, 26],
    [32, 26],
    [32, 18],
  ]
    .map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1" fill="#ffffff"/>`)
    .join('') +
  `<path d="M12 42c0 6 5 9 12 9 14 0 24-6 27-16-4-2-8-1-10 1" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>`;

const kubernetes = () => {
  const pts = Array.from({ length: 7 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    return `${(32 + 27 * Math.cos(a)).toFixed(1)},${(32 + 27 * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return (
    `<polygon points="${pts}" fill="#326ce5"/>` +
    `<path d="M32 18l12 7v14l-12 7-12-7V25z" fill="none" stroke="#ffffff" stroke-width="3"/>` +
    `<circle cx="32" cy="32" r="4" fill="#ffffff"/>`
  );
};

const linux = `<image href="${TUX_PNG}" x="5" y="0" width="54" height="64" preserveAspectRatio="xMidYMid meet"/>`;

const php =
  `<ellipse cx="32" cy="32" rx="31" ry="18" fill="#777bb3"/>` +
  label('php', '#ffffff', 19, 33);

const vue =
  `<path d="M4 12h12l16 27 16-27h12L32 58z" fill="#41b883"/>` +
  `<path d="M18 12h10l4 7 4-7h10L32 36z" fill="#35495e"/>`;

const angular =
  `<path d="M32 3l26 9-4 33-22 16-22-16-4-33z" fill="#dd0031"/>` +
  `<path d="M32 3v55l22-16 4-33z" fill="#c3002f"/>` +
  `<path d="M32 14l13 30h-5l-2.6-6.5H26.6L24 44h-5zm4 19l-4-9.5L28 33z" fill="#ffffff"/>`;

const tailwind =
  tile('#0f172a', '') +
  `<path d="M20 28c1.6-6.4 5.6-9.6 12-9.6 9.6 0 10.8 7.2 15.6 8.4 3.2.8 6-.4 8.4-3.6-1.6 6.4-5.6 9.6-12 9.6-9.6 0-10.8-7.2-15.6-8.4-3.2-.8-6 .4-8.4 3.6z" fill="#38bdf8"/>` +
  `<path d="M8 42c1.6-6.4 5.6-9.6 12-9.6 9.6 0 10.8 7.2 15.6 8.4 3.2.8 6-.4 8.4-3.6-1.6 6.4-5.6 9.6-12 9.6-9.6 0-10.8-7.2-15.6-8.4-3.2-.8-6 .4-8.4 3.6z" fill="#38bdf8"/>`;

const mongodb =
  tile('#001e2b', '') +
  `<path d="M32 10c7 9 11 16 11 23 0 8-5 13-11 17-6-4-11-9-11-17 0-7 4-14 11-23z" fill="#00ed64"/>` +
  `<path d="M32 12v38" stroke="#001e2b" stroke-width="2"/>`;

const cylinder = (top, body, txt) =>
  `<ellipse cx="32" cy="16" rx="22" ry="8" fill="${top}"/>` +
  `<path d="M10 16v32c0 4.4 9.8 8 22 8s22-3.6 22-8V16" fill="${body}"/>` +
  `<ellipse cx="32" cy="16" rx="22" ry="8" fill="${top}"/>` +
  (txt ? label(txt, '#ffffff', 15, 40) : '');

const wifi =
  `<path d="M32 50a5 5 0 100-10 5 5 0 000 10z" fill="currentColor"/>` +
  [
    ['M18 34a20 20 0 0128 0', 4],
    ['M10 25a31 31 0 0144 0', 4],
  ]
    .map(
      ([d, w]) =>
        `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round"/>`
    )
    .join('');

const router =
  `<rect x="6" y="36" width="52" height="20" rx="5" fill="currentColor"/>` +
  `<circle cx="16" cy="46" r="3" fill="#0f172a"/><circle cx="26" cy="46" r="3" fill="#0f172a"/>` +
  `<path d="M32 32V16M32 16l-9-8M32 16l9-8" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/>`;

const serverRack =
  [10, 26, 42]
    .map(
      (y) =>
        `<rect x="8" y="${y}" width="48" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>` +
        `<circle cx="18" cy="${y + 7}" r="2.5" fill="currentColor"/>` +
        `<rect x="28" y="${y + 5}" width="20" height="4" rx="2" fill="currentColor"/>`
    )
    .join('');

const cloudShape = (fill) =>
  `<path d="M20 48a12 12 0 01-1-24 16 16 0 0130-4 11 11 0 013 22z" fill="${fill}"/>`;

const terminalGlyph =
  `<rect x="4" y="10" width="56" height="44" rx="7" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M16 26l8 7-8 7M32 42h16" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

const codeGlyph =
  `<path d="M22 20L8 32l14 12M42 20l14 12-14 12M37 14L27 50" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

const shieldGlyph =
  `<path d="M32 4l22 8v18c0 14-9 24-22 30C19 54 10 44 10 30V12z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>` +
  `<path d="M23 32l6 6 13-13" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;

const globeGlyph =
  `<circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<ellipse cx="32" cy="32" rx="11" ry="26" fill="none" stroke="currentColor" stroke-width="3"/>` +
  `<path d="M7 22h50M7 42h50" stroke="currentColor" stroke-width="3"/>`;

const rocketGlyph =
  `<path d="M32 4c10 8 15 18 15 30l-6 8H23l-6-8c0-12 5-22 15-30z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>` +
  `<circle cx="32" cy="26" r="5" fill="currentColor"/>` +
  `<path d="M23 46l-6 12 10-4M41 46l6 12-10-4" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>`;

const gradGlyph =
  `<path d="M32 12L4 24l28 12 28-12z" fill="currentColor"/>` +
  `<path d="M16 31v12c0 4 7 8 16 8s16-4 16-8V31" fill="none" stroke="currentColor" stroke-width="4"/>`;

const bulbGlyph =
  `<path d="M32 6a17 17 0 00-10 30v6h20v-6A17 17 0 0032 6z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>` +
  `<path d="M26 50h12M28 57h8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;

const gearGlyph = () => {
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8;
    const x = 32 + 25 * Math.cos(a);
    const y = 32 + 25 * Math.sin(a);
    return `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" rx="2" transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="currentColor"/>`;
  }).join('');
  return (
    teeth +
    `<circle cx="32" cy="32" r="17" fill="none" stroke="currentColor" stroke-width="5"/>` +
    `<circle cx="32" cy="32" r="6" fill="currentColor"/>`
  );
};

const chartGlyph =
  `<path d="M8 54h48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>` +
  [
    [14, 34],
    [26, 22],
    [38, 30],
    [50, 12],
  ]
    .map(([x, y]) => `<rect x="${x - 5}" y="${y}" width="10" height="${52 - y}" rx="2" fill="currentColor"/>`)
    .join('');

/* ── Catalog ───────────────────────────────────────────────────────────── */

/* ── Contact, profile and support marks ─────────────────────────────────────
   A banner is something people are meant to act on, so these cover the "how to
   reach me" half that a technology library alone does not. All monochrome, so
   they take the user's tint like the other glyph icons. */

const envelope =
  `<rect x="6" y="14" width="52" height="36" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M9 19l23 17 23-17" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;

const handset =
  `<path d="M18 7c4 0 7 3 9 9s1 9-3 11c3 7 8 12 15 15 2-4 5-5 11-3s9 5 9 9-5 9-11 9C30 57 7 34 7 17 7 11 12 7 18 7z" fill="currentColor"/>`;

const pin =
  `<path d="M32 6c10 0 18 8 18 18 0 13-18 34-18 34S14 37 14 24c0-10 8-18 18-18z" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<circle cx="32" cy="24" r="7" fill="currentColor"/>`;

const calendarGlyph =
  `<rect x="8" y="14" width="48" height="42" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M8 27h48" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M20 8v11M44 8v11" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>` +
  [0, 1, 2].map((i) => `<rect x="${17 + i * 13}" y="35" width="9" height="9" rx="2" fill="currentColor"/>`).join('');

const certificateGlyph =
  `<rect x="9" y="9" width="46" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M17 19h30M17 27h18" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>` +
  `<circle cx="42" cy="43" r="9" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M35 50l-2 11 9-5 9 5-2-11" fill="currentColor"/>`;

const briefcaseGlyph =
  `<rect x="6" y="20" width="52" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M24 20v-6a4 4 0 014-4h8a4 4 0 014 4v6" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<path d="M6 34h52" stroke="currentColor" stroke-width="3.5"/>`;

const teamGlyph =
  `<circle cx="32" cy="19" r="8" fill="currentColor"/>` +
  `<circle cx="13" cy="25" r="6" fill="currentColor" fill-opacity="0.7"/>` +
  `<circle cx="51" cy="25" r="6" fill="currentColor" fill-opacity="0.7"/>` +
  `<path d="M18 48a14 14 0 0128 0z" fill="currentColor"/>` +
  `<path d="M4 46a11 11 0 0113-8M60 46a11 11 0 00-13-8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;

const toolsGlyph =
  `<path d="M41 7a15 15 0 00-14 20L8 46a5 5 0 007 7l19-19a15 15 0 0018-20l-9 9-8-2-2-8z" fill="currentColor"/>` +
  `<path d="M44 36l12 12a5 5 0 01-7 7L37 43" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;

const trophyGlyph =
  `<path d="M20 9h24v15a12 12 0 01-24 0z" fill="currentColor"/>` +
  `<path d="M20 13h-8a8 8 0 008 9M44 13h8a8 8 0 01-8 9" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<rect x="28" y="36" width="8" height="9" rx="2" fill="currentColor"/>` +
  `<rect x="17" y="47" width="30" height="9" rx="3" fill="currentColor"/>`;

const headsetGlyph =
  `<path d="M11 40V32a21 21 0 0142 0v8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>` +
  `<rect x="5" y="37" width="13" height="19" rx="6" fill="currentColor"/>` +
  `<rect x="46" y="37" width="13" height="19" rx="6" fill="currentColor"/>` +
  `<path d="M52 55c0 4-6 6-13 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;

const printerGlyph =
  `<path d="M18 20V7h28v13" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<rect x="5" y="20" width="54" height="21" rx="5" fill="currentColor"/>` +
  `<circle cx="49" cy="27" r="3" fill="#0f172a"/>` +
  `<rect x="17" y="35" width="30" height="21" rx="3" fill="#0f172a" stroke="currentColor" stroke-width="4"/>`;

const upsGlyph =
  `<rect x="7" y="16" width="43" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="4"/>` +
  `<rect x="52" y="26" width="6" height="12" rx="2" fill="currentColor"/>` +
  `<path d="M33 21l-10 15h8l-2 10 10-15h-8z" fill="currentColor"/>`;

const fiberGlyph =
  `<path d="M5 53c15 0 19-41 35-41" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>` +
  `<path d="M14 55c14 0 18-35 30-35" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.65"/>` +
  `<circle cx="45" cy="11" r="6" fill="currentColor"/>` +
  `<circle cx="47" cy="21" r="5" fill="currentColor" fill-opacity="0.65"/>`;

const rackGlyph =
  `<rect x="12" y="5" width="40" height="54" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>` +
  [12, 24, 36, 47]
    .map((y) => `<rect x="18" y="${y}" width="28" height="8" rx="2" fill="currentColor" fill-opacity="${y === 12 ? 1 : 0.6}"/>`)
    .join('');

export const ICON_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend & APIs',
  'Databases & data',
  'Cloud',
  'DevOps',
  'Systems & servers',
  'Networking',
  'Support & monitoring',
  'Design & tools',
  'Contact & profile',
  'Shapes & symbols',
];

// mono: true → the icon uses `currentColor` and can be recolored by the user.
export const ICONS = [
  /* Languages */
  { id: 'javascript', name: 'JavaScript', category: 'Languages', keywords: 'js node web', svg: tile('#f7df1e', label('JS', '#111827', 26)) },
  { id: 'typescript', name: 'TypeScript', category: 'Languages', keywords: 'ts types', svg: mono('#3178c6', 'TS') },
  { id: 'python', name: 'Python', category: 'Languages', keywords: 'py django flask data', svg: python },
  { id: 'java', name: 'Java', category: 'Languages', keywords: 'jvm spring', svg: mono('#ea2d2e', 'Java', '#ffffff', 16) },
  { id: 'php', name: 'PHP', category: 'Languages', keywords: 'laravel wordpress', svg: php },
  { id: 'csharp', name: 'C#', category: 'Languages', keywords: 'dotnet net microsoft', svg: mono('#68217a', 'C#') },
  { id: 'cpp', name: 'C++', category: 'Languages', keywords: 'c plus plus', svg: mono('#00599c', 'C++', '#ffffff', 20) },
  { id: 'c', name: 'C', category: 'Languages', keywords: 'clang systems', svg: mono('#03599c', 'C', '#ffffff', 28) },
  { id: 'go', name: 'Go', category: 'Languages', keywords: 'golang', svg: mono('#00add8', 'Go') },
  { id: 'rust', name: 'Rust', category: 'Languages', keywords: 'cargo systems', svg: mono('#111111', 'Rust', '#ffffff', 16) },
  { id: 'ruby', name: 'Ruby', category: 'Languages', keywords: 'rails', svg: mono('#cc342d', 'Ruby', '#ffffff', 16) },
  { id: 'kotlin', name: 'Kotlin', category: 'Languages', keywords: 'android jvm', svg: mono('#7f52ff', 'Kt') },
  { id: 'swift', name: 'Swift', category: 'Languages', keywords: 'ios apple', svg: mono('#f05138', 'Swift', '#ffffff', 15) },
  { id: 'sql', name: 'SQL', category: 'Languages', keywords: 'query database select', svg: mono('#0b7285', 'SQL', '#ffffff', 19) },
  { id: 'bash', name: 'Bash', category: 'Languages', keywords: 'shell script linux terminal', svg: tile('#111827', `<path d="M20 24l9 8-9 8M34 42h12" stroke="#4ade80" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`) },
  { id: 'powershell', name: 'PowerShell', category: 'Languages', keywords: 'windows shell script', svg: tile('#012456', `<path d="M20 22l12 10-12 10M34 44h14" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`) },

  /* Frontend */
  { id: 'html5', name: 'HTML5', category: 'Frontend', keywords: 'markup web page', svg: shield('#e34f26', '5') },
  { id: 'css3', name: 'CSS3', category: 'Frontend', keywords: 'style design web', svg: shield('#1572b6', '3') },
  { id: 'react', name: 'React', category: 'Frontend', keywords: 'jsx hooks spa meta', svg: react },
  { id: 'vue', name: 'Vue', category: 'Frontend', keywords: 'vuejs spa', svg: vue },
  { id: 'angular', name: 'Angular', category: 'Frontend', keywords: 'spa typescript google', svg: angular },
  { id: 'svelte', name: 'Svelte', category: 'Frontend', keywords: 'compiler spa', svg: mono('#ff3e00', 'Sv') },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', keywords: 'react ssr vercel', svg: mono('#000000', 'N', '#ffffff', 30) },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', keywords: 'css utility style', svg: tailwind },
  { id: 'bootstrap', name: 'Bootstrap', category: 'Frontend', keywords: 'css framework grid', svg: mono('#7952b3', 'B', '#ffffff', 32) },
  { id: 'sass', name: 'Sass', category: 'Frontend', keywords: 'scss css preprocessor', svg: mono('#cd6799', 'Sass', '#ffffff', 15) },
  { id: 'jquery', name: 'jQuery', category: 'Frontend', keywords: 'javascript dom', svg: mono('#0769ad', 'jQ') },
  { id: 'figma', name: 'Figma', category: 'Design & tools', keywords: 'design ui ux prototype', svg: tile('#1e1e1e', `<circle cx="26" cy="20" r="8" fill="#f24e1e"/><circle cx="40" cy="32" r="8" fill="#1abcfe"/><circle cx="26" cy="32" r="8" fill="#a259ff"/><circle cx="26" cy="44" r="8" fill="#0acf83"/>`) },

  /* Backend */
  { id: 'nodejs', name: 'Node.js', category: 'Backend & APIs', keywords: 'javascript server npm', svg: nodejs },
  { id: 'express', name: 'Express', category: 'Backend & APIs', keywords: 'node api rest', svg: mono('#111827', 'Ex') },
  { id: 'django', name: 'Django', category: 'Backend & APIs', keywords: 'python web', svg: mono('#092e20', 'dj') },
  { id: 'flask', name: 'Flask', category: 'Backend & APIs', keywords: 'python micro api', svg: mono('#111827', 'Fl') },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend & APIs', keywords: 'python async api', svg: mono('#059669', 'API', '#ffffff', 19) },
  { id: 'laravel', name: 'Laravel', category: 'Backend & APIs', keywords: 'php framework', svg: mono('#ff2d20', 'Lv') },
  { id: 'spring', name: 'Spring', category: 'Backend & APIs', keywords: 'java boot', svg: mono('#6db33f', 'Sp') },
  { id: 'dotnet', name: '.NET', category: 'Backend & APIs', keywords: 'csharp microsoft', svg: mono('#512bd4', '.NET', '#ffffff', 15) },
  { id: 'graphql', name: 'GraphQL', category: 'Backend & APIs', keywords: 'api query schema', svg: mono('#e10098', 'GQL', '#ffffff', 17) },
  { id: 'rest', name: 'REST API', category: 'Backend & APIs', keywords: 'api http endpoint', svg: mono('#0ea5e9', 'REST', '#ffffff', 14) },

  /* Databases */
  { id: 'mysql', name: 'MySQL', category: 'Databases & data', keywords: 'sql relational db', svg: cylinder('#00758f', '#005c73', 'SQL') },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Databases & data', keywords: 'postgres sql relational db', svg: cylinder('#336791', '#27506f', 'PG') },
  { id: 'mongodb', name: 'MongoDB', category: 'Databases & data', keywords: 'nosql document db', svg: mongodb },
  { id: 'sqlite', name: 'SQLite', category: 'Databases & data', keywords: 'embedded sql db', svg: cylinder('#003b57', '#002a3f', 'lite') },
  { id: 'redis', name: 'Redis', category: 'Databases & data', keywords: 'cache key value memory', svg: cylinder('#d82c20', '#a81f16', '') },
  { id: 'oracle', name: 'Oracle DB', category: 'Databases & data', keywords: 'sql enterprise db', svg: mono('#c74634', 'ORA', '#ffffff', 17) },
  { id: 'sqlserver', name: 'SQL Server', category: 'Databases & data', keywords: 'microsoft mssql db', svg: cylinder('#a91d22', '#7d1519', 'MS') },
  { id: 'firebase', name: 'Firebase', category: 'Databases & data', keywords: 'google realtime nosql', svg: mono('#ffca28', 'FB', '#111827') },
  { id: 'supabase', name: 'Supabase', category: 'Databases & data', keywords: 'postgres backend', svg: mono('#3ecf8e', 'Sb', '#052e1b') },
  { id: 'database', name: 'Database', category: 'Databases & data', keywords: 'generic data storage db', svg: cylinder('#64748b', '#475569', '') },

  /* Cloud & DevOps */
  { id: 'linux', name: 'Linux', category: 'Systems & servers', keywords: 'tux kernel unix open source', svg: linux },
  { id: 'ubuntu', name: 'Ubuntu', category: 'Systems & servers', keywords: 'linux distro debian', svg: tile('#e95420', `<circle cx="32" cy="32" r="16" fill="none" stroke="#ffffff" stroke-width="4"/><circle cx="46" cy="32" r="5" fill="#ffffff"/><circle cx="25" cy="20" r="5" fill="#ffffff"/><circle cx="25" cy="44" r="5" fill="#ffffff"/>`) },
  { id: 'debian', name: 'Debian', category: 'Systems & servers', keywords: 'linux distro', svg: mono('#a80030', 'Deb', '#ffffff', 17) },
  { id: 'redhat', name: 'Red Hat', category: 'Systems & servers', keywords: 'linux rhel enterprise', svg: mono('#ee0000', 'RH') },
  { id: 'git', name: 'Git', category: 'DevOps', keywords: 'version control commit branch', svg: git },
  { id: 'github', name: 'GitHub', category: 'DevOps', keywords: 'git repo open source', svg: github },
  { id: 'gitlab', name: 'GitLab', category: 'DevOps', keywords: 'git ci repo', svg: mono('#fc6d26', 'GL', '#ffffff', 20) },
  { id: 'docker', name: 'Docker', category: 'DevOps', keywords: 'container image devops', svg: docker },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', keywords: 'k8s orchestration container', svg: kubernetes() },
  { id: 'aws', name: 'AWS', category: 'Cloud', keywords: 'amazon cloud ec2 s3', svg: tile('#232f3e', label('aws', '#ff9900', 20, 28) + `<path d="M16 42c10 6 22 6 32 0" stroke="#ff9900" stroke-width="3.5" fill="none" stroke-linecap="round"/>`) },
  { id: 'azure', name: 'Azure', category: 'Cloud', keywords: 'microsoft cloud', svg: tile('#0078d4', `<path d="M26 10h14l14 34H36l-6-10h8L26 10z" fill="#ffffff"/><path d="M24 16L10 48h20l4-8-10-2z" fill="#ffffff" fill-opacity="0.75"/>`) },
  { id: 'gcp', name: 'Google Cloud', category: 'Cloud', keywords: 'gcp google cloud', svg: tile('#ffffff', cloudShape('#4285f4') + label('GCP', '#1a73e8', 13, 52)) },
  { id: 'cloud', name: 'Cloud', category: 'Cloud', keywords: 'generic cloud hosting', svg: cloudShape('currentColor'), mono: true },
  { id: 'terraform', name: 'Terraform', category: 'DevOps', keywords: 'iac infrastructure hashicorp', svg: mono('#7b42bc', 'Tf') },
  { id: 'ansible', name: 'Ansible', category: 'DevOps', keywords: 'automation config redhat', svg: mono('#111827', 'An') },
  { id: 'jenkins', name: 'Jenkins', category: 'DevOps', keywords: 'ci cd pipeline build', svg: mono('#d24939', 'CI') },
  { id: 'nginx', name: 'NGINX', category: 'Systems & servers', keywords: 'web server proxy', svg: mono('#009639', 'N', '#ffffff', 30) },
  { id: 'apache', name: 'Apache', category: 'Systems & servers', keywords: 'httpd web server', svg: mono('#d22128', 'Ap') },
  { id: 'server', name: 'Server', category: 'Systems & servers', keywords: 'rack hosting datacenter', svg: serverRack, mono: true },

  /* Networking */
  { id: 'cisco', name: 'Cisco', category: 'Networking', keywords: 'network router switch ccna', svg: tile('#1ba0d7', [12, 20, 28, 36, 44, 52].map((x, i) => `<rect x="${x - 2}" y="${[30, 24, 18, 18, 24, 30][i]}" width="4" height="${[12, 18, 24, 24, 18, 12][i]}" rx="2" fill="#ffffff"/>`).join('')) },
  { id: 'wifi', name: 'Wi-Fi', category: 'Networking', keywords: 'wireless signal network', svg: wifi, mono: true },
  { id: 'router', name: 'Router', category: 'Networking', keywords: 'network gateway hardware', svg: router, mono: true },
  { id: 'switch', name: 'Switch', category: 'Networking', keywords: 'network lan port hardware', svg: `<rect x="6" y="24" width="52" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>${[14, 22, 30, 38, 46].map((x) => `<rect x="${x}" y="30" width="5" height="6" rx="1" fill="currentColor"/>`).join('')}`, mono: true },
  { id: 'firewall', name: 'Firewall', category: 'Networking', keywords: 'security network protection', svg: shieldGlyph, mono: true },
  { id: 'ethernet', name: 'Ethernet', category: 'Networking', keywords: 'rj45 cable lan network', svg: `<path d="M22 10h20v14h8v22H14V24h8z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>${[20, 28, 36, 44].map((x) => `<rect x="${x}" y="30" width="4" height="8" fill="currentColor"/>`).join('')}`, mono: true },
  { id: 'wireshark', name: 'Wireshark', category: 'Networking', keywords: 'packet capture analysis network', svg: tile('#1679a7', `<path d="M12 32c8-12 32-12 40 0-8 12-32 12-40 0z" fill="#ffffff"/><circle cx="32" cy="32" r="6" fill="#1679a7"/>`) },
  { id: 'vpn', name: 'VPN', category: 'Networking', keywords: 'tunnel secure remote network', svg: mono('#0f766e', 'VPN', '#ffffff', 16) },
  { id: 'dns', name: 'DNS', category: 'Networking', keywords: 'domain name resolution network', svg: mono('#1d4ed8', 'DNS', '#ffffff', 16) },
  { id: 'network', name: 'Network', category: 'Networking', keywords: 'topology nodes mesh', svg: `${[[32, 12], [12, 44], [52, 44], [32, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="currentColor"/>`).join('')}<path d="M32 12v22M32 34L12 44M32 34l20 10" stroke="currentColor" stroke-width="3.5" fill="none"/>`, mono: true },
  { id: 'globe', name: 'Internet', category: 'Networking', keywords: 'globe world web www', svg: globeGlyph, mono: true },

  /* Tools */
  { id: 'vscode', name: 'VS Code', category: 'Design & tools', keywords: 'editor ide microsoft', svg: tile('#0065a9', `<path d="M44 10l10 5v34l-10 5-20-19-10 8-6-4 12-11-12-11 6-4 10 8z" fill="#ffffff"/>`) },
  { id: 'postman', name: 'Postman', category: 'Design & tools', keywords: 'api testing rest', svg: mono('#ff6c37', 'Pm') },
  { id: 'jira', name: 'Jira', category: 'Design & tools', keywords: 'agile tickets atlassian scrum', svg: mono('#0052cc', 'Jira', '#ffffff', 16) },
  { id: 'slack', name: 'Slack', category: 'Design & tools', keywords: 'chat team communication', svg: mono('#4a154b', 'Sl') },
  { id: 'notion', name: 'Notion', category: 'Design & tools', keywords: 'notes docs wiki', svg: mono('#ffffff', 'N', '#111827', 30) },
  { id: 'grafana', name: 'Grafana', category: 'Support & monitoring', keywords: 'dashboard monitoring metrics', svg: mono('#f46800', 'Gf') },
  { id: 'prometheus', name: 'Prometheus', category: 'Support & monitoring', keywords: 'monitoring metrics alerts', svg: mono('#e6522c', 'Pr') },
  { id: 'virtualbox', name: 'VirtualBox', category: 'Systems & servers', keywords: 'vm virtualization lab', svg: mono('#183a61', 'VB') },
  { id: 'vmware', name: 'VMware', category: 'Systems & servers', keywords: 'vm virtualization esxi', svg: mono('#607078', 'VM') },
  { id: 'windows', name: 'Windows', category: 'Systems & servers', keywords: 'microsoft os desktop', svg: tile('#0078d4', `<rect x="12" y="12" width="18" height="18" fill="#ffffff"/><rect x="34" y="12" width="18" height="18" fill="#ffffff"/><rect x="12" y="34" width="18" height="18" fill="#ffffff"/><rect x="34" y="34" width="18" height="18" fill="#ffffff"/>`) },
  { id: 'terminal', name: 'Terminal', category: 'Design & tools', keywords: 'console shell cli command', svg: terminalGlyph, mono: true },

  /* Shapes & Symbols */
  { id: 'code', name: 'Code', category: 'Shapes & symbols', keywords: 'brackets developer programming', svg: codeGlyph, mono: true },
  { id: 'rocket', name: 'Rocket', category: 'Shapes & symbols', keywords: 'launch growth startup', svg: rocketGlyph, mono: true },
  { id: 'graduation', name: 'Graduation cap', category: 'Contact & profile', keywords: 'student school learning atc', svg: gradGlyph, mono: true },
  { id: 'lightbulb', name: 'Idea', category: 'Shapes & symbols', keywords: 'bulb creative learning', svg: bulbGlyph, mono: true },
  { id: 'gear', name: 'Gear', category: 'Shapes & symbols', keywords: 'settings engineering support', svg: gearGlyph(), mono: true },
  { id: 'chart', name: 'Chart', category: 'Shapes & symbols', keywords: 'analytics data growth', svg: chartGlyph, mono: true },
  { id: 'shield', name: 'Shield', category: 'Shapes & symbols', keywords: 'security safe protection', svg: shieldGlyph, mono: true },
  { id: 'star', name: 'Star', category: 'Shapes & symbols', keywords: 'favorite rating highlight', svg: `<path d="M32 6l8 17 19 2.5-14 13 4 19-17-9-17 9 4-19-14-13L24 23z" fill="currentColor"/>`, mono: true },
  { id: 'check', name: 'Check', category: 'Shapes & symbols', keywords: 'done success tick', svg: `<circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="4"/><path d="M20 33l8 9 17-19" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, mono: true },
  { id: 'heart', name: 'Heart', category: 'Shapes & symbols', keywords: 'passion love like', svg: `<path d="M32 55S8 41 8 25a12 12 0 0124-6 12 12 0 0124 6c0 16-24 30-24 30z" fill="currentColor"/>`, mono: true },
  /* Contact & profile — the "how to reach me" half of a banner */
  { id: 'linkedin', name: 'LinkedIn', category: 'Contact & profile', keywords: 'profile social network perfil', svg: mono('#0a66c2', 'in', '#ffffff', 26) },
  { id: 'email', name: 'Email', category: 'Contact & profile', keywords: 'mail contact correo mensaje', svg: envelope, mono: true },
  { id: 'phone', name: 'Phone', category: 'Contact & profile', keywords: 'call contact telefono movil', svg: handset, mono: true },
  { id: 'location', name: 'Location', category: 'Contact & profile', keywords: 'map pin city ubicacion lugar', svg: pin, mono: true },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Contact & profile', keywords: 'chat message contact mensaje', svg: tile('#25d366', `<path d="M32 12c11 0 20 9 20 20 0 11-9 20-20 20-3 0-6-1-9-2l-9 3 3-9c-2-3-3-7-3-12 0-11 9-20 20-20z" fill="#ffffff"/><path d="M26 24c1 0 2 0 3 2l2 4-2 2c2 4 4 6 8 8l2-2 4 2c2 1 2 2 2 3 0 2-2 4-5 4-8 0-18-10-18-18 0-3 2-5 4-5z" fill="#25d366"/>`) },
  { id: 'calendar', name: 'Calendar', category: 'Contact & profile', keywords: 'date schedule availability agenda fecha', svg: calendarGlyph, mono: true },
  { id: 'certificate', name: 'Certificate', category: 'Contact & profile', keywords: 'certification diploma award certificado titulo', svg: certificateGlyph, mono: true },
  { id: 'comptia', name: 'CompTIA', category: 'Contact & profile', keywords: 'certification a+ network+ security+ certificacion', svg: tile('#c8202f', label('C+', '#ffffff', 24)) },
  { id: 'briefcase', name: 'Briefcase', category: 'Contact & profile', keywords: 'work job hiring experience trabajo empleo', svg: briefcaseGlyph, mono: true },
  { id: 'team', name: 'Team', category: 'Contact & profile', keywords: 'people group collaboration equipo personas', svg: teamGlyph, mono: true },

  /* Networking additions */
  { id: 'packettracer', name: 'Packet Tracer', category: 'Networking', keywords: 'cisco simulator lab ccna network redes', svg: mono('#1ba0d7', 'PT', '#ffffff', 24) },
  { id: 'mikrotik', name: 'MikroTik', category: 'Networking', keywords: 'router os network hardware routeros', svg: mono('#293239', 'MT', '#ffffff', 24) },
  { id: 'fortinet', name: 'Fortinet', category: 'Networking', keywords: 'firewall security fortigate seguridad', svg: mono('#ee3124', 'FTN', '#ffffff', 17) },
  { id: 'pfsense', name: 'pfSense', category: 'Networking', keywords: 'firewall router bsd security', svg: mono('#212121', 'pf', '#ffffff', 26) },
  { id: 'nmap', name: 'Nmap', category: 'Networking', keywords: 'scan ports security audit escaneo', svg: mono('#4b0082', 'Nm', '#ffffff', 24) },
  { id: 'putty', name: 'PuTTY', category: 'Networking', keywords: 'ssh telnet terminal console consola', svg: mono('#4a4a4a', 'Pu', '#ffffff', 24) },
  { id: 'fiber', name: 'Fiber optic', category: 'Networking', keywords: 'optical cable fibra optica link', svg: fiberGlyph, mono: true },

  /* Support & monitoring */
  { id: 'headset', name: 'Help desk', category: 'Support & monitoring', keywords: 'support helpdesk service soporte mesa de ayuda', svg: headsetGlyph, mono: true },
  { id: 'printer', name: 'Printer', category: 'Support & monitoring', keywords: 'peripheral hardware office impresora', svg: printerGlyph, mono: true },
  { id: 'ups', name: 'UPS', category: 'Support & monitoring', keywords: 'power battery backup energia respaldo', svg: upsGlyph, mono: true },
  { id: 'tools', name: 'Tools', category: 'Support & monitoring', keywords: 'maintenance repair fix herramientas mantenimiento', svg: toolsGlyph, mono: true },
  { id: 'zabbix', name: 'Zabbix', category: 'Support & monitoring', keywords: 'monitoring alerts infrastructure monitoreo', svg: mono('#d40000', 'Zx', '#ffffff', 24) },

  /* Cloud additions */
  { id: 'cloudflare', name: 'Cloudflare', category: 'Cloud', keywords: 'cdn dns proxy security', svg: tile('#f38020', cloudShape('#ffffff')) },
  { id: 'vercel', name: 'Vercel', category: 'Cloud', keywords: 'hosting deploy frontend nextjs', svg: tile('#000000', `<path d="M32 16l18 32H14z" fill="#ffffff"/>`) },
  { id: 'netlify', name: 'Netlify', category: 'Cloud', keywords: 'hosting deploy jamstack', svg: mono('#00c7b7', 'N', '#ffffff', 30) },
  { id: 'proxmox', name: 'Proxmox', category: 'Cloud', keywords: 'virtualization hypervisor ve virtualizacion', svg: mono('#e57000', 'PVE', '#ffffff', 17) },

  /* DevOps additions */
  { id: 'githubactions', name: 'GitHub Actions', category: 'DevOps', keywords: 'ci cd pipeline automation', svg: tile('#2088ff', `<circle cx="32" cy="32" r="14" fill="none" stroke="#ffffff" stroke-width="6"/><circle cx="32" cy="32" r="5" fill="#ffffff"/>`) },
  { id: 'helm', name: 'Helm', category: 'DevOps', keywords: 'kubernetes charts packages k8s', svg: mono('#0f1689', 'Hm', '#ffffff', 24) },
  { id: 'jest', name: 'Jest', category: 'DevOps', keywords: 'testing unit javascript pruebas', svg: mono('#c21325', 'J', '#ffffff', 30) },
  { id: 'cypress', name: 'Cypress', category: 'DevOps', keywords: 'testing e2e end to end pruebas', svg: mono('#17202c', 'Cy', '#ffffff', 24) },

  /* Frontend additions */
  { id: 'wordpress', name: 'WordPress', category: 'Frontend', keywords: 'cms blog website php sitio web', svg: mono('#21759b', 'W', '#ffffff', 30) },
  { id: 'vite', name: 'Vite', category: 'Frontend', keywords: 'bundler build tool frontend', svg: tile('#646cff', `<path d="M35 9L17 37h11l-4 18 19-29H32z" fill="#ffd62e"/>`) },
  { id: 'webpack', name: 'Webpack', category: 'Frontend', keywords: 'bundler build modules', svg: tile('#8dd6f9', `<path d="M32 10l20 11v22L32 54 12 43V21z" fill="none" stroke="#1c78c0" stroke-width="4"/><path d="M32 22l10 6v12l-10 6-10-6V28z" fill="#1c78c0"/>`) },
  { id: 'storybook', name: 'Storybook', category: 'Frontend', keywords: 'components ui documentation', svg: mono('#ff4785', 'SB', '#ffffff', 22) },
  { id: 'astro', name: 'Astro', category: 'Frontend', keywords: 'static site framework web', svg: mono('#ff5d01', 'A', '#ffffff', 30) },

  /* Backend additions */
  { id: 'npm', name: 'npm', category: 'Backend & APIs', keywords: 'packages node registry paquetes', svg: tile('#cb3837', label('npm', '#ffffff', 16)) },

  /* Databases & data additions */
  { id: 'mariadb', name: 'MariaDB', category: 'Databases & data', keywords: 'sql relational database base de datos', svg: mono('#003545', 'Mdb', '#ffffff', 17) },
  { id: 'phpmyadmin', name: 'phpMyAdmin', category: 'Databases & data', keywords: 'mysql admin web sql gestor', svg: mono('#6c78af', 'pMA', '#ffffff', 17) },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'Databases & data', keywords: 'search index logs elk busqueda', svg: mono('#005571', 'ES', '#ffffff', 24) },
  { id: 'powerbi', name: 'Power BI', category: 'Databases & data', keywords: 'analytics dashboard microsoft reports informes', svg: tile('#f2c811', [16, 26, 36, 46].map((x, i) => `<rect x="${x}" y="${44 - [10, 18, 26, 32][i]}" width="7" height="${[10, 18, 26, 32][i]}" rx="2" fill="#3b3b1a"/>`).join('')) },
  { id: 'excel', name: 'Excel', category: 'Databases & data', keywords: 'spreadsheet office data hoja de calculo', svg: tile('#217346', label('X', '#ffffff', 28)) },

  /* Design & tools additions */
  { id: 'photoshop', name: 'Photoshop', category: 'Design & tools', keywords: 'adobe image editing graphics diseno imagen', svg: tile('#001e36', label('Ps', '#31a8ff', 26)) },
  { id: 'illustrator', name: 'Illustrator', category: 'Design & tools', keywords: 'adobe vector graphics diseno', svg: tile('#330000', label('Ai', '#ff9a00', 26)) },
  { id: 'canva', name: 'Canva', category: 'Design & tools', keywords: 'design graphics templates diseno', svg: mono('#00c4cc', 'C', '#ffffff', 30) },
];

export const ICON_BY_ID = Object.fromEntries(ICONS.map((i) => [i.id, i]));

// Wraps icon markup into a standalone SVG document and encodes it as a data URI
// so the very same string works in <img> and in the canvas export.
export function iconDataUri(svg, tint) {
  const body = tint ? svg.replaceAll('currentColor', tint) : svg.replaceAll('currentColor', '#e2e8f0');
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64">${body}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(doc);
}

export function searchIcons(list, query, category) {
  const q = query.trim().toLowerCase();
  return list.filter((i) => {
    if (category !== 'All' && i.category !== category) return false;
    if (!q) return true;
    return `${i.name} ${i.id} ${i.keywords || ''}`.toLowerCase().includes(q);
  });
}
