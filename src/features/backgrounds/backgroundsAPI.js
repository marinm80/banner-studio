// Background API. This implementation is local: it deterministically generates
// themed SVG backgrounds and serves them with the same contract a remote API
// would use:
//   GET /api/backgrounds?theme={theme}&page={page}&limit={limit}
// To plug in a real provider (Unsplash, Pexels…) just replace fetchBackgrounds
// while keeping the response shape.
//
// Backgrounds are pure patterns — no baked-in text. Anything readable on the
// banner is an editable layer, so every design stays 100% customizable.

const W = 1500;
const H = 500;

// Seeded PRNG (mulberry32) so the catalog is stable across sessions.
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const PALETTES = {
  // dark
  blue: { id: 'blue', bg0: '#050b18', bg1: '#0b1f3a', accent: '#38bdf8', accent2: '#818cf8' },
  violet: { id: 'violet', bg0: '#0d0616', bg1: '#231043', accent: '#a78bfa', accent2: '#f472b6' },
  green: { id: 'green', bg0: '#03110a', bg1: '#052e1b', accent: '#34d399', accent2: '#a3e635' },
  cyan: { id: 'cyan', bg0: '#04121a', bg1: '#083344', accent: '#22d3ee', accent2: '#38bdf8' },
  amber: { id: 'amber', bg0: '#120b03', bg1: '#2d1a05', accent: '#fbbf24', accent2: '#fb7185' },
  graphite: { id: 'graphite', bg0: '#0a0a0f', bg1: '#1c1c26', accent: '#94a3b8', accent2: '#e2e8f0' },
  crimson: { id: 'crimson', bg0: '#16050a', bg1: '#3b0d1c', accent: '#fb7185', accent2: '#fdba74' },
  // light
  light: { id: 'light', bg0: '#ffffff', bg1: '#e0f2fe', accent: '#2563eb', accent2: '#7c3aed' },
  pastel: { id: 'pastel', bg0: '#fdf2f8', bg1: '#ede9fe', accent: '#db2777', accent2: '#7c3aed' },
  mint: { id: 'mint', bg0: '#f0fdfa', bg1: '#dcfce7', accent: '#0d9488', accent2: '#16a34a' },
  corporate: { id: 'corporate', bg0: '#f8fafc', bg1: '#dbeafe', accent: '#1d4ed8', accent2: '#0891b2' },
  sand: { id: 'sand', bg0: '#fffbeb', bg1: '#fef3c7', accent: '#b45309', accent2: '#0f766e' },
};

const wrap = (p, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="${p.bg0}"/><stop offset="1" stop-color="${p.bg1}"/>` +
  `</linearGradient></defs>` +
  `<rect width="${W}" height="${H}" fill="url(#g)"/>${body}</svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── Technology patterns ────────────────────────────────────────────────── */

function circuits(p, r) {
  let el = '';
  for (let i = 0; i < 28; i++) {
    let x = r() * W;
    let y = r() * H;
    let d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    for (let s = 0; s < 4; s++) {
      const len = 40 + r() * 160;
      if (r() < 0.5) x += r() < 0.5 ? len : -len;
      else y += r() < 0.5 ? len : -len;
      d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    el +=
      `<path d="${d}" fill="none" stroke="${p.accent}" stroke-opacity="${(0.15 + r() * 0.35).toFixed(2)}" stroke-width="2"/>` +
      `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="${p.accent2}" fill-opacity="0.8"/>`;
  }
  return el;
}

const TOKENS = [
  'const', 'let', '=>', 'async', 'await', 'fetch(', 'return', '{', '}', 'import',
  'export', 'render()', 'useState', 'docker', 'kubectl', 'git push', 'npm run',
  'SELECT *', '</>', 'try {', 'catch', '0x1F', '&&', '||', '===', 'null',
];

function code(p, r) {
  let el = '';
  for (let row = 0; row < 14; row++) {
    let x = 20 + r() * 120;
    const y = 32 + row * 34;
    while (x < W - 120) {
      const t = TOKENS[(r() * TOKENS.length) | 0];
      const color = r() < 0.3 ? p.accent2 : p.accent;
      el += `<text x="${x | 0}" y="${y}" font-family="monospace" font-size="22" fill="${color}" fill-opacity="${(0.1 + r() * 0.3).toFixed(2)}">${esc(t)}</text>`;
      x += t.length * 13 + 20 + r() * 60;
    }
  }
  return el;
}

function network(p, r) {
  const pts = Array.from({ length: 34 }, () => [r() * W, r() * H]);
  let el = '';
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d < 260) {
        el += `<line x1="${pts[i][0] | 0}" y1="${pts[i][1] | 0}" x2="${pts[j][0] | 0}" y2="${pts[j][1] | 0}" stroke="${p.accent}" stroke-opacity="${(0.35 * (1 - d / 260)).toFixed(2)}" stroke-width="1.5"/>`;
      }
    }
  }
  for (const [x, y] of pts) {
    el += `<circle cx="${x | 0}" cy="${y | 0}" r="${(2 + r() * 4).toFixed(1)}" fill="${p.accent2}" fill-opacity="0.7"/>`;
  }
  return el;
}

function matrix(p, r) {
  let el = '';
  for (let col = 0; col < 46; col++) {
    const x = 10 + col * 33;
    const n = 3 + ((r() * 12) | 0);
    const y0 = r() * H;
    for (let k = 0; k < n; k++) {
      const op = Math.max(0.05, 0.5 - k * 0.05);
      el += `<text x="${x}" y="${((y0 + k * 26) % (H + 40)).toFixed(0)}" font-family="monospace" font-size="20" fill="${k === 0 ? p.accent2 : p.accent}" fill-opacity="${op.toFixed(2)}">${r() < 0.5 ? 0 : 1}</text>`;
    }
  }
  return el;
}

function hexes(p, r) {
  const s = 46;
  let el = '';
  const hexPath = (cx, cy) => {
    let d = '';
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      d += (k ? 'L' : 'M') + (cx + s * Math.cos(a)).toFixed(1) + ' ' + (cy + s * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  };
  for (let row = 0; row * s * 1.5 < H + s; row++) {
    for (let col = 0; col * s * 1.73 < W + s; col++) {
      if (r() < 0.45) continue;
      const cx = col * s * 1.73 + (row % 2 ? s * 0.865 : 0);
      const cy = row * s * 1.5;
      el += `<path d="${hexPath(cx, cy)}" fill="none" stroke="${r() < 0.15 ? p.accent2 : p.accent}" stroke-opacity="${(0.08 + r() * 0.3).toFixed(2)}" stroke-width="1.5"/>`;
    }
  }
  return el;
}

function waves(p, r) {
  let el = '';
  for (let i = 0; i < 4; i++) {
    const base = 180 + i * 90 + r() * 40;
    let d = `M0 ${base.toFixed(0)}`;
    for (let x = 0; x <= W; x += 250) {
      d += ` S ${x + 125} ${(base - 80 + r() * 160).toFixed(0)}, ${x + 250} ${(base + r() * 60 - 30).toFixed(0)}`;
    }
    d += ` L${W + 300} ${H + 50} L0 ${H + 50} Z`;
    el += `<path d="${d}" fill="${i % 2 ? p.accent : p.accent2}" fill-opacity="${(0.05 + i * 0.04).toFixed(2)}"/>`;
  }
  return el;
}

function retrogrid(p, r) {
  let el = `<circle cx="${(W * (0.3 + r() * 0.4)) | 0}" cy="170" r="130" fill="${p.accent2}" fill-opacity="0.16"/>`;
  const horizon = 230;
  for (let i = 0; i < 12; i++) {
    const y = horizon + Math.pow(i / 11, 1.8) * (H - horizon);
    el += `<line x1="0" y1="${y.toFixed(0)}" x2="${W}" y2="${y.toFixed(0)}" stroke="${p.accent}" stroke-opacity="${(0.12 + i * 0.03).toFixed(2)}" stroke-width="1.5"/>`;
  }
  for (let i = -14; i <= 14; i++) {
    el += `<line x1="${W / 2 + i * 60}" y1="${horizon}" x2="${W / 2 + i * 220}" y2="${H}" stroke="${p.accent}" stroke-opacity="0.15" stroke-width="1.5"/>`;
  }
  el += `<line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${p.accent2}" stroke-opacity="0.5" stroke-width="2"/>`;
  return el;
}

const CMDS = [
  'sudo apt install nginx',
  'git commit -m "feat: deploy"',
  'docker build -t app .',
  'kubectl apply -f k8s/',
  'npm run build',
  'ssh user@server',
  'chmod +x setup.sh',
  'ping -c 4 8.8.8.8',
  'curl -X POST /api/login',
  'python3 manage.py migrate',
  'tar -xzvf backup.tar.gz',
  'grep -r "error" logs/',
  'ip addr show',
  'node server.js',
  'systemctl restart nginx',
];

// Scattered watermark commands with varied size, tilt and opacity. Each
// candidate is checked against the ones already placed (approximate bounding
// box, ignoring rotation) so they do not overlap; after a few failed tries it
// is placed anyway to avoid infinite loops in crowded areas.
function commands(p, r) {
  let el = '';
  const placed = [];
  const pad = 16;
  for (let i = 0; i < 16; i++) {
    let x, y, fs, rot, c, w, h;
    for (let tries = 0; tries < 40; tries++) {
      c = CMDS[(r() * CMDS.length) | 0];
      fs = 18 + r() * 26;
      x = r() * (W - 300);
      y = 40 + r() * (H - 60);
      rot = (r() * 16 - 8) | 0;
      w = ('$ ' + c).length * fs * 0.62;
      h = fs * 1.2;
      const overlaps = placed.some(
        (b) => x < b.x + b.w + pad && x + w + pad > b.x && y - h < b.y + pad && y + pad > b.y - b.h
      );
      if (!overlaps) break;
    }
    placed.push({ x, y, w, h });
    const col = r() < 0.3 ? p.accent2 : p.accent;
    el += `<text x="${x | 0}" y="${y | 0}" transform="rotate(${rot} ${x | 0} ${y | 0})" font-family="monospace" font-size="${fs | 0}" fill="${col}" fill-opacity="${(0.08 + r() * 0.22).toFixed(2)}">${esc('$ ' + c)}</text>`;
  }
  return el;
}

function neon(p, r) {
  let el = `<ellipse cx="${W / 2}" cy="${H / 2}" rx="420" ry="200" fill="${p.accent}" fill-opacity="0.12"/>`;
  for (let i = 0; i < 8; i++) {
    const x = r() * W;
    el += `<polygon points="${x | 0},0 ${(x + 60) | 0},0 ${(x + 260) | 0},${H} ${(x + 200) | 0},${H}" fill="${r() < 0.5 ? p.accent : p.accent2}" fill-opacity="${(0.05 + r() * 0.1).toFixed(2)}"/>`;
  }
  for (let i = 0; i < 5; i++) {
    let x = r() * W;
    let y = 0;
    let d = `M${x | 0} 0`;
    for (let s = 0; s < 6; s++) {
      x += (r() - 0.5) * 120;
      y += 40 + r() * 60;
      d += ` L${x | 0} ${y | 0}`;
    }
    el += `<path d="${d}" fill="none" stroke="${p.accent2}" stroke-opacity="0.5" stroke-width="2.5"/>`;
  }
  return el;
}

function blueprint(p, r) {
  let el = '';
  for (let x = 0; x <= W; x += 50) {
    el += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${p.accent}" stroke-opacity="${x % 250 === 0 ? 0.28 : 0.1}" stroke-width="1"/>`;
  }
  for (let y = 0; y <= H; y += 50) {
    el += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${p.accent}" stroke-opacity="${y % 250 === 0 ? 0.28 : 0.1}" stroke-width="1"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const x = (r() * (W - 300)) | 0;
    const y = (r() * (H - 200)) | 0;
    el += `<rect x="${x}" y="${y}" width="${(120 + r() * 200) | 0}" height="${(80 + r() * 120) | 0}" fill="none" stroke="${p.accent2}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="8 6"/>`;
  }
  return el;
}

function particles(p, r) {
  let el = `<circle cx="${(W * 0.75) | 0}" cy="140" r="220" fill="${p.accent}" fill-opacity="0.07"/>`;
  for (let i = 0; i < 160; i++) {
    el += `<circle cx="${(r() * W) | 0}" cy="${(r() * H) | 0}" r="${(0.8 + r() * 2.6).toFixed(1)}" fill="${r() < 0.25 ? p.accent2 : p.accent}" fill-opacity="${(0.1 + r() * 0.45).toFixed(2)}"/>`;
  }
  return el;
}

/* ── ATC · Information Technology disciplines ───────────────────────────── */

// Browser windows + markup tags → Web Development.
function webDevelopment(p, r) {
  let el = '';
  // Frames stay in the right two thirds so the name and headline, which live on
  // the left, always sit on quiet background.
  const frames = [
    [640, 90, 380, 250],
    [1060, 60, 380, 130],
    [1060, 220, 380, 150],
  ];
  frames.forEach(([x, y, w, h], i) => {
    el +=
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${p.accent}" fill-opacity="0.06" stroke="${p.accent}" stroke-opacity="${0.28 + i * 0.06}" stroke-width="2"/>` +
      `<line x1="${x}" y1="${y + 34}" x2="${x + w}" y2="${y + 34}" stroke="${p.accent}" stroke-opacity="0.3" stroke-width="2"/>` +
      [0, 1, 2]
        .map((k) => `<circle cx="${x + 20 + k * 18}" cy="${y + 17}" r="5" fill="${p.accent2}" fill-opacity="0.55"/>`)
        .join('');
    for (let row = 0; row < Math.floor((h - 60) / 30); row++) {
      const lw = 40 + r() * (w - 90);
      el += `<rect x="${x + 20}" y="${y + 52 + row * 30}" width="${lw | 0}" height="10" rx="5" fill="${row % 3 === 0 ? p.accent2 : p.accent}" fill-opacity="${(0.12 + r() * 0.2).toFixed(2)}"/>`;
    }
  });
  const tags = ['&lt;/&gt;', '&lt;div&gt;', '&lt;h1&gt;', '{ }', '&lt;a&gt;', '&lt;/body&gt;'];
  tags.forEach((t, i) => {
    el += `<text x="${(520 + r() * (W - 680)) | 0}" y="${(90 + r() * (H - 180)) | 0}" font-family="monospace" font-size="${(26 + r() * 22) | 0}" fill="${i % 2 ? p.accent2 : p.accent}" fill-opacity="${(0.12 + r() * 0.16).toFixed(2)}">${t}</text>`;
  });
  return el;
}

// Clouds, regions and dashed links → Cloud Computing.
function cloudComputing(p, r) {
  const cloud = (cx, cy, s, op) =>
    `<g transform="translate(${cx} ${cy}) scale(${s})">` +
    `<path d="M-70 30a34 34 0 015-67 46 46 0 0187-12 32 32 0 0110 79z" fill="${p.accent}" fill-opacity="${op}" stroke="${p.accent2}" stroke-opacity="${(op * 2.2).toFixed(2)}" stroke-width="2"/>` +
    `</g>`;
  // Clouds and racks live in the right two thirds so the text side stays clean.
  let el = cloud(940, 140, 1.5, 0.1) + cloud(1340, 210, 1.05, 0.09) + cloud(690, 90, 0.75, 0.12);
  const nodes = [
    [660, 380],
    [860, 400],
    [1060, 360],
    [1260, 400],
    [1440, 370],
  ];
  nodes.forEach(([x, y], i) => {
    el +=
      `<rect x="${x - 34}" y="${y - 24}" width="68" height="48" rx="10" fill="${p.bg0}" fill-opacity="0.45" stroke="${p.accent}" stroke-opacity="0.45" stroke-width="2"/>` +
      [0, 1, 2]
        .map((k) => `<rect x="${x - 22}" y="${y - 14 + k * 11}" width="44" height="5" rx="2.5" fill="${k === 0 ? p.accent2 : p.accent}" fill-opacity="0.5"/>`)
        .join('');
    if (i) {
      el += `<line x1="${nodes[i - 1][0] + 34}" y1="${nodes[i - 1][1]}" x2="${x - 34}" y2="${y}" stroke="${p.accent}" stroke-opacity="0.3" stroke-dasharray="6 6" stroke-width="2"/>`;
    }
    el += `<line x1="${x}" y1="${y - 24}" x2="${(x + (r() * 60 - 30)) | 0}" y2="220" stroke="${p.accent2}" stroke-opacity="0.16" stroke-dasharray="4 8" stroke-width="2"/>`;
  });
  for (let i = 0; i < 70; i++) {
    el += `<circle cx="${(r() * W) | 0}" cy="${(r() * H) | 0}" r="1.6" fill="${p.accent}" fill-opacity="${(0.1 + r() * 0.25).toFixed(2)}"/>`;
  }
  return el;
}

// Routers, switches and signal arcs → Network Support Services.
function networkSupport(p, r) {
  const device = (x, y, w) =>
    `<rect x="${x - w / 2}" y="${y - 16}" width="${w}" height="32" rx="8" fill="${p.bg0}" fill-opacity="0.5" stroke="${p.accent}" stroke-opacity="0.5" stroke-width="2"/>` +
    Array.from({ length: 5 }, (_, k) => `<rect x="${x - w / 2 + 12 + k * 14}" y="${y - 4}" width="7" height="8" rx="2" fill="${p.accent2}" fill-opacity="0.6"/>`).join('');

  // The topology sits in the right two thirds so the name stays legible.
  const hub = [1000, 250];
  const spokes = [
    [640, 110],
    [620, 400],
    [860, 60],
    [880, 430],
    [1180, 70],
    [1200, 430],
    [1420, 160],
    [1400, 380],
  ];
  let el = '';
  spokes.forEach(([x, y]) => {
    el += `<line x1="${hub[0]}" y1="${hub[1]}" x2="${x}" y2="${y}" stroke="${p.accent}" stroke-opacity="0.28" stroke-width="2" stroke-dasharray="10 7"/>`;
    el += device(x, y, 92);
  });
  el +=
    `<circle cx="${hub[0]}" cy="${hub[1]}" r="70" fill="${p.accent}" fill-opacity="0.1"/>` +
    `<circle cx="${hub[0]}" cy="${hub[1]}" r="52" fill="${p.bg0}" fill-opacity="0.6" stroke="${p.accent2}" stroke-opacity="0.6" stroke-width="2.5"/>` +
    device(hub[0], hub[1], 108);
  for (let i = 1; i <= 4; i++) {
    el += `<circle cx="${hub[0]}" cy="${hub[1]}" r="${70 + i * 55}" fill="none" stroke="${p.accent2}" stroke-opacity="${(0.22 - i * 0.04).toFixed(2)}" stroke-width="2"/>`;
  }
  for (let i = 0; i < 50; i++) {
    el += `<circle cx="${(r() * W) | 0}" cy="${(r() * H) | 0}" r="1.8" fill="${p.accent}" fill-opacity="${(0.08 + r() * 0.2).toFixed(2)}"/>`;
  }
  return el;
}

// Cylinders, table grids and SQL keywords → Database Application Development.
function databaseDev(p, r) {
  const cylinder = (x, y, w, h, op) => {
    const ry = w * 0.22;
    return (
      `<path d="M${x - w / 2} ${y}V${y + h}A${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y + h}V${y}Z" fill="${p.accent}" fill-opacity="${op}" stroke="${p.accent}" stroke-opacity="${(op * 3).toFixed(2)}" stroke-width="2"/>` +
      `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${ry}" fill="${p.accent2}" fill-opacity="${(op * 1.6).toFixed(2)}" stroke="${p.accent2}" stroke-opacity="0.5" stroke-width="2"/>` +
      `<ellipse cx="${x}" cy="${y + h * 0.5}" rx="${w / 2}" ry="${ry}" fill="none" stroke="${p.accent}" stroke-opacity="0.25" stroke-width="1.5"/>`
    );
  };
  // Kept to the right half so the name and headline stay on quiet background.
  let el = cylinder(1290, 120, 190, 180, 0.1) + cylinder(900, 95, 120, 110, 0.09);

  const table = (x, y, cols, rows) => {
    const cw = 78;
    const rh = 30;
    let t = `<rect x="${x}" y="${y}" width="${cols * cw}" height="${rh}" fill="${p.accent2}" fill-opacity="0.2"/>`;
    for (let c = 0; c <= cols; c++) {
      t += `<line x1="${x + c * cw}" y1="${y}" x2="${x + c * cw}" y2="${y + rows * rh}" stroke="${p.accent}" stroke-opacity="0.25" stroke-width="1.5"/>`;
    }
    for (let rr = 0; rr <= rows; rr++) {
      t += `<line x1="${x}" y1="${y + rr * rh}" x2="${x + cols * cw}" y2="${y + rr * rh}" stroke="${p.accent}" stroke-opacity="0.25" stroke-width="1.5"/>`;
    }
    return t;
  };
  el += table(620, 270, 4, 4) + table(1010, 250, 3, 4);
  el += `<path d="M932 330 L1010 310" stroke="${p.accent2}" stroke-opacity="0.5" stroke-width="2.5" stroke-dasharray="7 5"/>`;

  ['SELECT *', 'JOIN', 'WHERE', 'INSERT INTO', 'PRIMARY KEY', 'GROUP BY'].forEach((t, i) => {
    el += `<text x="${(600 + r() * (W - 780)) | 0}" y="${(100 + r() * (H - 200)) | 0}" font-family="monospace" font-size="${(22 + r() * 18) | 0}" fill="${i % 2 ? p.accent2 : p.accent}" fill-opacity="${(0.1 + r() * 0.16).toFixed(2)}">${t}</text>`;
  });
  return el;
}

/* ── General-purpose patterns (light, non-technical) ────────────────────── */

function poly(p, r) {
  let el = '';
  for (let i = 0; i < 16; i++) {
    const x = r() * W;
    const y = r() * H;
    const s = 40 + r() * 140;
    const a = r() * 360;
    el += `<polygon points="0,${-s | 0} ${(s * 0.87) | 0},${(s / 2) | 0} ${(-s * 0.87) | 0},${(s / 2) | 0}" transform="translate(${x | 0} ${y | 0}) rotate(${a | 0})" fill="${r() < 0.5 ? p.accent : p.accent2}" fill-opacity="${(0.05 + r() * 0.1).toFixed(2)}" stroke="${p.accent}" stroke-opacity="0.25"/>`;
  }
  const pts = Array.from({ length: 14 }, () => [r() * W, r() * H]);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d < 300) {
        el += `<line x1="${pts[i][0] | 0}" y1="${pts[i][1] | 0}" x2="${pts[j][0] | 0}" y2="${pts[j][1] | 0}" stroke="${p.accent}" stroke-opacity="0.18" stroke-width="1"/>`;
      }
    }
  }
  for (const [x, y] of pts) {
    el += `<circle cx="${x | 0}" cy="${y | 0}" r="3" fill="${p.accent}" fill-opacity="0.4"/>`;
  }
  return el;
}

function flat(p, r) {
  let el = '';
  for (let x = 30; x < W; x += 60) {
    for (let y = 30; y < H; y += 60) {
      if (r() < 0.35) el += `<circle cx="${x}" cy="${y}" r="3" fill="${p.accent}" fill-opacity="0.22"/>`;
    }
  }
  for (let i = 0; i < 7; i++) {
    const x = r() * W;
    const y = r() * H;
    const rad = 30 + r() * 90;
    el +=
      r() < 0.5
        ? `<circle cx="${x | 0}" cy="${y | 0}" r="${rad | 0}" fill="${r() < 0.5 ? p.accent : p.accent2}" fill-opacity="0.1"/>`
        : `<circle cx="${x | 0}" cy="${y | 0}" r="${rad | 0}" fill="none" stroke="${p.accent2}" stroke-opacity="0.3" stroke-width="6"/>`;
  }
  for (let i = 0; i < 4; i++) {
    const x = r() * W;
    const y = r() * H;
    el += `<rect x="${x | 0}" y="${y | 0}" width="${(60 + r() * 120) | 0}" height="14" rx="7" transform="rotate(${(r() * 60 - 30) | 0} ${x | 0} ${y | 0})" fill="${r() < 0.5 ? p.accent : p.accent2}" fill-opacity="0.15"/>`;
  }
  return el;
}

function bokeh(p, r) {
  let el = '';
  for (let i = 0; i < 18; i++) {
    const x = r() * W;
    const y = r() * H;
    const rad = 15 + r() * 80;
    el += `<circle cx="${x | 0}" cy="${y | 0}" r="${rad | 0}" fill="${r() < 0.5 ? p.accent : p.accent2}" fill-opacity="${(0.05 + r() * 0.12).toFixed(2)}"/>`;
  }
  return el;
}

function stripes(p, r) {
  let el = '';
  for (let i = -6; i < 30; i++) {
    const x = i * 70;
    el += `<polygon points="${x},0 ${x + 34},0 ${x + 34 - 160},${H} ${x - 160},${H}" fill="${i % 3 === 0 ? p.accent2 : p.accent}" fill-opacity="${(0.05 + (i % 4) * 0.02).toFixed(2)}"/>`;
  }
  el += `<circle cx="${(W * 0.8) | 0}" cy="120" r="180" fill="${p.accent2}" fill-opacity="0.08"/>`;
  return el;
}

function mesh(p, r) {
  let el = '';
  for (let i = 0; i < 5; i++) {
    el += `<ellipse cx="${(r() * W) | 0}" cy="${(r() * H) | 0}" rx="${(200 + r() * 260) | 0}" ry="${(140 + r() * 160) | 0}" fill="${i % 2 ? p.accent : p.accent2}" fill-opacity="0.11"/>`;
  }
  return el;
}

/* ── Catalog ────────────────────────────────────────────────────────────── */

const GENERATORS = [
  // technology
  { key: 'circuits', label: 'Circuits', theme: 'technology', tags: ['circuits', 'hardware', 'futuristic'], pals: ['blue', 'cyan', 'violet'], draw: circuits },
  { key: 'code', label: 'Code rain', theme: 'technology', tags: ['code', 'development', 'programming', 'web'], pals: ['graphite', 'blue', 'violet'], draw: code },
  { key: 'network', label: 'Node network', theme: 'technology', tags: ['network', 'nodes', 'connections'], pals: ['cyan', 'violet', 'blue'], draw: network },
  { key: 'matrix', label: 'Binary matrix', theme: 'technology', tags: ['matrix', 'data', 'binary'], pals: ['green', 'cyan', 'graphite'], draw: matrix },
  { key: 'hex', label: 'Hexagons', theme: 'technology', tags: ['hexagons', 'pattern', 'geometry'], pals: ['violet', 'blue', 'amber'], draw: hexes },
  { key: 'waves', label: 'Waves', theme: 'technology', tags: ['waves', 'abstract', 'gradient'], pals: ['violet', 'cyan', 'amber'], draw: waves },
  { key: 'grid', label: 'Retro grid', theme: 'technology', tags: ['retro', 'grid', 'synthwave'], pals: ['violet', 'amber', 'cyan'], draw: retrogrid },
  { key: 'commands', label: 'Shell commands', theme: 'technology', tags: ['commands', 'linux', 'bash', 'terminal', 'devops'], pals: ['graphite', 'green', 'blue'], draw: commands },
  { key: 'neon', label: 'Neon', theme: 'technology', tags: ['neon', 'gaming', 'glow'], pals: ['violet', 'cyan', 'green'], draw: neon },
  { key: 'blueprint', label: 'Blueprint', theme: 'technology', tags: ['blueprint', 'grid', 'engineering', 'architecture'], pals: ['blue', 'cyan', 'graphite'], draw: blueprint },
  { key: 'particles', label: 'Particles', theme: 'technology', tags: ['particles', 'stars', 'minimal', 'dark'], pals: ['blue', 'violet', 'crimson'], draw: particles },
  // ATC · Information Technology disciplines (still inside the technology theme)
  { key: 'atcweb', label: 'ATC · Web Development', theme: 'technology', tags: ['atc', 'web development', 'frontend', 'html', 'css', 'javascript'], pals: ['blue', 'violet', 'cyan'], draw: webDevelopment },
  { key: 'atccloud', label: 'ATC · Cloud Computing', theme: 'technology', tags: ['atc', 'cloud computing', 'aws', 'azure', 'devops', 'servers'], pals: ['cyan', 'blue', 'violet'], draw: cloudComputing },
  { key: 'atcnet', label: 'ATC · Network Support Services', theme: 'technology', tags: ['atc', 'network support services', 'networking', 'cisco', 'support', 'infrastructure'], pals: ['green', 'blue', 'graphite'], draw: networkSupport },
  { key: 'atcdb', label: 'ATC · Database Application Development', theme: 'technology', tags: ['atc', 'database application development', 'database', 'sql', 'data'], pals: ['violet', 'blue', 'amber'], draw: databaseDev },
  // general purpose
  { key: 'poly', label: 'Polygons', theme: 'general', tags: ['polygons', 'triangles', 'corporate', 'light'], pals: ['light', 'corporate', 'pastel'], draw: poly },
  { key: 'flat', label: 'Minimal shapes', theme: 'general', tags: ['minimal', 'flat', 'shapes', 'corporate', 'light'], pals: ['light', 'pastel', 'mint'], draw: flat },
  { key: 'bokeh', label: 'Bokeh', theme: 'general', tags: ['bokeh', 'circles', 'soft', 'elegant', 'light'], pals: ['pastel', 'light', 'mint'], draw: bokeh },
  { key: 'softwaves', label: 'Soft waves', theme: 'general', tags: ['waves', 'soft', 'pastel', 'light'], pals: ['mint', 'pastel', 'corporate'], draw: waves },
  { key: 'stripes', label: 'Diagonal stripes', theme: 'general', tags: ['stripes', 'diagonal', 'corporate', 'bold'], pals: ['corporate', 'sand', 'light'], draw: stripes },
  { key: 'mesh', label: 'Gradient mesh', theme: 'general', tags: ['gradient', 'mesh', 'soft', 'modern'], pals: ['pastel', 'mint', 'sand', 'violet'], draw: mesh },
];

let CATALOG = null;

function buildCatalog() {
  if (CATALOG) return CATALOG;
  CATALOG = [];
  GENERATORS.forEach((g, gi) => {
    g.pals.forEach((palId, k) => {
      const p = PALETTES[palId];
      const r = rng(gi * 97 + k * 13 + 1);
      const svg = wrap(p, g.draw(p, r));
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      CATALOG.push({
        id: `bg_${g.key}_${p.id}`,
        url,
        thumbnailUrl: url,
        theme: g.theme,
        label: `${g.label} · ${p.id}`,
        tags: g.tags,
        license: 'generated',
      });
    });
  });
  return CATALOG;
}

export function getBackgroundById(id) {
  return buildCatalog().find((b) => b.id === id) || null;
}

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export async function fetchBackgrounds({ theme = 'all', page = 1, limit = 12 } = {}) {
  const all = buildCatalog();
  const q = norm(theme);

  let filtered;
  if (!q || q === 'all') filtered = all;
  else if (['technology', 'tech', 'it'].includes(q)) filtered = all.filter((b) => b.theme === 'technology');
  else if (q === 'general') filtered = all.filter((b) => b.theme === 'general');
  else filtered = all.filter((b) => b.tags.some((t) => norm(t).includes(q)) || norm(b.label).includes(q));

  // Simulated latency so the async flow matches a real remote API.
  await new Promise((res) => setTimeout(res, 180));

  const start = (page - 1) * limit;
  return { page, limit, total: filtered.length, items: filtered.slice(start, start + limit) };
}
