// Starter templates. Each one is a complete, ready-to-edit banner: pick it,
// change the name, and you already have something you can post. Every value is
// still fully editable afterwards — templates are a starting point, not a lock.

import { getBackgroundById } from '../features/backgrounds/backgroundsAPI';
import { makeText, makeIcon, makeTerminal } from '../features/editor/editorSlice';
import { coverTransform } from '../utils/canvasUtils';

export const TEMPLATE_GROUPS = ['ATC · Information Technology', 'General'];

const CANVAS = { width: 1584, height: 396 };

// Evenly spaced icon row along the bottom band, clear of the text block.
const iconRow = (ids, { x = 84, y = 286, size = 66, gap = 84, tint, badge = 'none' } = {}) =>
  ids.map((id, i) =>
    makeIcon(id, {
      x: x + i * gap,
      y,
      size,
      badge,
      ...(tint ? { tint } : {}),
    })
  );

// One icon per socket, centred on it. The icon is deliberately smaller than the
// socket plate so the ring still reads as a socket around it. Fewer ids than
// sockets simply repeats them.
const nodeIcons = (sockets, ids) =>
  sockets.map((s, i) => {
    const size = Math.max(24, Math.round(s.size * 0.62));
    return makeIcon(ids[i % ids.length], {
      name: `Node ${i + 1}`,
      x: Math.round(s.x - size / 2),
      y: Math.round(s.y - size / 2),
      size,
    });
  });

// A dark shadow lifts text off a dark background, but on light backgrounds it
// just muddies the letters — hence the flag.
const heading = (name, color = '#ffffff', shadow = true) =>
  makeText({
    name: 'Your name',
    text: name,
    font: 'Montserrat',
    size: 62,
    weight: 700,
    color,
    x: 80,
    y: 82,
    shadow: { enabled: shadow, color: '#000000', blur: 14, dx: 0, dy: 3 },
  });

const headline = (text, color, shadow = true) =>
  makeText({
    name: 'Headline',
    text,
    font: 'Inter',
    size: 28,
    weight: 700,
    color,
    x: 84,
    y: 162,
    shadow: { enabled: shadow, color: '#000000', blur: 10, dx: 0, dy: 2 },
  });

const tagline = (text, color, shadow = true) =>
  makeText({
    name: 'Tagline',
    text,
    font: 'Inter',
    size: 21,
    color,
    x: 84,
    y: 208,
    shadow: { enabled: shadow, color: '#000000', blur: 8, dx: 0, dy: 2 },
  });

export const TEMPLATES = [
  {
    id: 'topology-network',
    name: 'Network topology',
    group: 'ATC · Information Technology',
    description: 'Hub and spokes. Every node is an icon you can swap.',
    backgroundId: 'bg_topohub_green',
    build: (sockets) => [
      heading('Your Name'),
      headline('Network Support Services Student · ATC', '#6ee7b7'),
      ...nodeIcons(sockets, ['cisco', 'router', 'switch', 'firewall', 'wifi', 'server', 'ethernet']),
    ],
  },
  {
    id: 'topology-stack',
    name: 'My stack, connected',
    group: 'ATC · Information Technology',
    description: 'A mesh of the tools you use. Change any node for your own.',
    backgroundId: 'bg_topomesh_cyan',
    build: (sockets) => [
      heading('Your Name'),
      headline('Information Technology Student · ATC', '#67e8f9'),
      ...nodeIcons(sockets, ['python', 'javascript', 'react', 'nodejs', 'mysql', 'git']),
    ],
  },
  {
    id: 'topology-pipeline',
    name: 'Cloud pipeline',
    group: 'ATC · Information Technology',
    description: 'Your toolchain in order, one icon per step.',
    backgroundId: 'bg_topopipe_cyan',
    build: (sockets) => [
      heading('Your Name'),
      headline('Cloud Computing Student · ATC', '#67e8f9'),
      ...nodeIcons(sockets, ['git', 'github', 'docker', 'kubernetes', 'terraform', 'aws']),
    ],
  },
  /* ── ATC · Information Technology ─────────────────────────────────────── */
  {
    id: 'atc-web-development',
    name: 'Web Development',
    group: 'ATC · Information Technology',
    description: 'Browser mockups and front-end stack icons.',
    backgroundId: 'bg_atcweb_blue',
    build: () => [
      heading('Your Name'),
      headline('Web Development Student · ATC', '#93c5fd'),
      tagline('HTML · CSS · JavaScript · React — building for the web', '#cbd5e1'),
      ...iconRow(['html5', 'css3', 'javascript', 'react', 'git', 'github']),
    ],
  },
  {
    id: 'atc-cloud-computing',
    name: 'Cloud Computing',
    group: 'ATC · Information Technology',
    description: 'Cloud regions, nodes and DevOps tooling.',
    backgroundId: 'bg_atccloud_cyan',
    build: () => [
      heading('Your Name'),
      headline('Cloud Computing Student · ATC', '#67e8f9'),
      tagline('AWS · Azure · Containers · Infrastructure as Code', '#cbd5e1'),
      ...iconRow(['aws', 'azure', 'docker', 'kubernetes', 'linux', 'terraform']),
    ],
  },
  {
    id: 'atc-network-support',
    name: 'Network Support Services',
    group: 'ATC · Information Technology',
    description: 'Network topology with routers, switches and signal.',
    backgroundId: 'bg_atcnet_green',
    build: () => [
      heading('Your Name'),
      headline('Network Support Services Student · ATC', '#6ee7b7'),
      tagline('Routing · Switching · Troubleshooting · Help Desk', '#cbd5e1'),
      ...iconRow(['cisco', 'router', 'switch', 'wifi', 'linux', 'wireshark'], { tint: '#6ee7b7' }),
    ],
  },
  {
    id: 'atc-database-development',
    name: 'Database Application Development',
    group: 'ATC · Information Technology',
    description: 'Data cylinders, table diagrams and SQL keywords.',
    backgroundId: 'bg_atcdb_violet',
    build: () => [
      heading('Your Name'),
      headline('Database Application Development Student · ATC', '#c4b5fd'),
      tagline('SQL · Data modeling · Queries · Reporting', '#e2e8f0'),
      ...iconRow(['mysql', 'postgresql', 'mongodb', 'sql', 'python', 'oracle']),
    ],
  },
  {
    id: 'atc-information-technology',
    name: 'Information Technology (general)',
    group: 'ATC · Information Technology',
    description: 'For any IT track — pick your own icons afterwards.',
    backgroundId: 'bg_blueprint_blue',
    build: () => [
      heading('Your Name'),
      headline('Information Technology Student · ATC', '#93c5fd'),
      tagline('Learning every day · Open to internships and junior roles', '#cbd5e1'),
      ...iconRow(['graduation', 'code', 'linux', 'git', 'database', 'network'], { tint: '#93c5fd' }),
    ],
  },

  /* ── General ──────────────────────────────────────────────────────────── */
  {
    id: 'linux-terminal',
    name: 'Linux terminal',
    group: 'General',
    description: 'An editable terminal window — change every command line.',
    backgroundId: 'bg_particles_blue',
    build: () => [
      heading('Your Name'),
      headline('Linux · Systems · Automation', '#a5b4fc'),
      tagline('Comfortable in the shell', '#cbd5e1'),
      makeTerminal({ x: 880, y: 46, width: 620, fontSize: 19 }),
      ...iconRow(['linux', 'git', 'bash', 'docker'], { x: 84, y: 282, size: 70, gap: 92 }),
    ],
  },
  {
    id: 'open-to-work',
    name: 'Open to work',
    group: 'General',
    description: 'Light, friendly and readable — great for a first banner.',
    backgroundId: 'bg_flat_light',
    build: () => [
      heading('Your Name', '#0f172a', false),
      headline('Open to work · Junior IT roles', '#1d4ed8', false),
      tagline('Ready to learn, contribute and grow with your team', '#334155', false),
      ...iconRow(['rocket', 'check', 'star'], { x: 84, y: 288, size: 56, gap: 72, tint: '#1d4ed8' }),
    ],
  },
  {
    id: 'developer-dark',
    name: 'Developer dark',
    group: 'General',
    description: 'Classic dark code background with your stack on display.',
    backgroundId: 'bg_code_graphite',
    build: () => [
      heading('Your Name'),
      headline('Software Developer', '#a5b4fc'),
      tagline('Turning ideas into working software', '#cbd5e1'),
      ...iconRow(['javascript', 'python', 'react', 'nodejs', 'git', 'docker']),
    ],
  },
  {
    id: 'minimal-light',
    name: 'Minimal light',
    group: 'General',
    description: 'Soft gradient, plenty of breathing room, dark text.',
    backgroundId: 'bg_mesh_pastel',
    build: () => [
      makeText({
        name: 'Your name',
        text: 'Your Name',
        font: 'Playfair Display',
        size: 60,
        weight: 700,
        color: '#111827',
        x: 80,
        y: 120,
      }),
      makeText({
        name: 'Headline',
        text: 'Information Technology · Student · Panamá',
        font: 'Inter',
        size: 24,
        color: '#334155',
        x: 84,
        y: 205,
      }),
    ],
  },
  {
    id: 'centered-statement',
    name: 'Centered statement',
    group: 'General',
    description: 'One bold line in the middle. Simple and confident.',
    backgroundId: 'bg_mesh_violet',
    build: () => [
      makeText({
        name: 'Statement',
        text: 'Learning. Building. Shipping.',
        font: 'Bebas Neue',
        size: 84,
        weight: 400,
        color: '#ffffff',
        align: 'center',
        x: 440,
        y: 130,
        shadow: { enabled: true, color: '#000000', blur: 16, dx: 0, dy: 4 },
      }),
      makeText({
        name: 'Your name',
        text: 'Your Name · IT Student',
        font: 'Inter',
        size: 26,
        color: '#e9d5ff',
        align: 'center',
        x: 490,
        y: 240,
      }),
    ],
  },
  {
    id: 'blank',
    name: 'Blank canvas',
    group: 'General',
    description: 'Just a background and one text layer. Build it your way.',
    backgroundId: 'bg_particles_violet',
    build: () => [heading('Your Name')],
  },
];

// Sockets are described in the background's own coordinate space, and the banner
// paints that background with object-fit: cover — so the positions have to be
// put through the same crop before anything can be placed on them.
function socketsOnCanvas(bg, canvas) {
  if (!bg?.nodes?.length || !bg.space) return [];
  const { scale, offsetX, offsetY } = coverTransform(
    bg.space.w,
    bg.space.h,
    canvas.width,
    canvas.height
  );
  return bg.nodes.map((n) => ({
    x: offsetX + n.x * scale,
    y: offsetY + n.y * scale,
    size: n.r * 2 * scale,
  }));
}

export function buildTemplate(template) {
  const bg = getBackgroundById(template.backgroundId);
  const canvas = { ...CANVAS };
  // Templates without sockets ignore the argument.
  return {
    canvas,
    background: bg ? { source: 'api', id: bg.id, url: bg.url } : null,
    layers: template.build(socketsOnCanvas(bg, canvas)),
  };
}

// Small, cheap preview: the background thumbnail plus a couple of text bars,
// so the gallery stays instant even with every template on screen.
export function templatePreview(template) {
  return getBackgroundById(template.backgroundId)?.thumbnailUrl || null;
}
