// The banner. Canvas size, background, the layer array, the selection and the
// undo history all live here; every panel reads this slice and dispatches to
// it.
//
// Two things to know before changing a reducer:
//   - Array order is stacking order — layers[last] is drawn on top.
//   - Anything that mutates calls record() first to push an undo snapshot.
//     Pass a coalesce key for continuous edits (a drag, a slider) so a burst
//     collapses into one undo step instead of hundreds.

import { createSlice, nanoid } from '@reduxjs/toolkit';
import { ICON_BY_ID } from '../../data/icons';

export const CANVAS_PRESETS = [
  { id: 'linkedin-profile', label: 'LinkedIn profile cover', width: 1584, height: 396 },
  { id: 'linkedin-company', label: 'LinkedIn company cover', width: 1128, height: 191 },
  { id: 'wide', label: 'Wide banner', width: 1500, height: 500 },
  { id: 'x-header', label: 'X / Twitter header', width: 1500, height: 500 },
  { id: 'github-social', label: 'GitHub social preview', width: 1280, height: 640 },
];

export const DEFAULT_CANVAS = { width: 1584, height: 396, fill: '#0f172a' };

// The region LinkedIn keeps visible on every device, as a fraction of the
// canvas. CanvasEditor draws it as the dashed "safe area" and alignTextLayers
// uses the horizontal one as its margin, so aligned text lands exactly on that
// boundary instead of somewhere arbitrary.
export const SAFE_AREA_X_RATIO = 0.06;
export const SAFE_AREA_Y_RATIO = 0.12;

const baseText = {
  type: 'text',
  font: 'Inter',
  size: 36,
  color: '#ffffff',
  weight: 400,
  align: 'left',
  opacity: 1,
  rotation: 0,
  shadow: { enabled: false, color: '#000000', blur: 8, dx: 0, dy: 2 },
  box: { enabled: false, color: '#000000', opacity: 0.45, padX: 18, padY: 10, radius: 10 },
};

export const makeText = (patch = {}) => ({
  id: nanoid(8),
  name: 'Text',
  text: 'New text',
  x: 520,
  y: 170,
  ...baseText,
  ...patch,
  shadow: { ...baseText.shadow, ...(patch.shadow || {}) },
  box: { ...baseText.box, ...(patch.box || {}) },
});

export const makeIcon = (iconId, patch = {}) => {
  const def = ICON_BY_ID[iconId];
  return {
    id: nanoid(8),
    type: 'icon',
    name: def?.name || 'Icon',
    iconId,
    svg: def?.svg || '',
    mono: !!def?.mono,
    tint: def?.mono ? '#e2e8f0' : null,
    size: 88,
    x: 120,
    y: 260,
    opacity: 1,
    rotation: 0,
    badge: 'none', // none | circle | rounded
    badgeColor: '#38bdf8',
    badgeOpacity: 0.14,
    ...patch,
  };
};

export const makeCustomIcon = (icon, patch = {}) => ({
  id: nanoid(8),
  type: 'icon',
  name: icon.name || 'Custom icon',
  iconId: icon.id,
  svg: icon.svg || '',
  src: icon.src || null, // bitmap icons uploaded by the user
  mono: false,
  tint: null,
  size: 88,
  x: 120,
  y: 260,
  opacity: 1,
  rotation: 0,
  badge: 'none',
  badgeColor: '#38bdf8',
  badgeOpacity: 0.14,
  ...patch,
});

export const DEFAULT_TERMINAL_LINES = [
  '$ whoami',
  'your-name — IT student',
  '$ git status',
  'On branch main — nothing to commit',
  '$ npm run build',
  'Build finished successfully',
].join('\n');

export const makeTerminal = (patch = {}) => ({
  id: nanoid(8),
  type: 'terminal',
  name: 'Terminal',
  lines: DEFAULT_TERMINAL_LINES,
  x: 900,
  y: 60,
  width: 560,
  fontSize: 19,
  lineGap: 30,
  padding: 26,
  titleBar: true,
  title: '',
  bgColor: '#000000',
  bgOpacity: 0.55,
  borderColor: '#38bdf8',
  promptColor: '#818cf8',
  textColor: '#38bdf8',
  radius: 14,
  opacity: 1,
  rotation: 0,
  ...patch,
});

export const makeImage = (src, patch = {}) => ({
  id: nanoid(8),
  type: 'image',
  name: 'Image',
  src,
  width: 180,
  x: 1240,
  y: 60,
  opacity: 1,
  rotation: 0,
  radius: 0,
  ...patch,
});

const starterLayers = () => [
  makeText({
    name: 'Your name',
    text: 'Your Name',
    font: 'Montserrat',
    size: 66,
    weight: 700,
    x: 90,
    y: 110,
    shadow: { enabled: true, color: '#000000', blur: 12, dx: 0, dy: 3 },
  }),
  makeText({
    name: 'Headline',
    text: 'Information Technology Student · Open to opportunities',
    size: 28,
    color: '#c7d2fe',
    x: 94,
    y: 200,
    shadow: { enabled: true, color: '#000000', blur: 8, dx: 0, dy: 2 },
  }),
];

const freshState = () => ({
  canvas: { ...DEFAULT_CANVAS },
  background: null, // { source: 'api' | 'upload' | 'color', url?, id?, color? }
  layers: starterLayers(),
  selectedId: null,
  showGrid: false,
  showSafeArea: false,
  exportSettings: { quality: 0.92, filename: 'my-linkedin-banner', format: 'jpeg' },
});

const initialState = {
  ...freshState(),
  past: [],
  future: [],
  coalesceKey: null,
};

const snapshot = (s) => ({
  canvas: { ...s.canvas },
  background: s.background ? { ...s.background } : null,
  layers: JSON.parse(JSON.stringify(s.layers)),
});

const restore = (state, snap) => {
  state.canvas = snap.canvas;
  state.background = snap.background;
  state.layers = snap.layers;
  if (!state.layers.some((l) => l.id === state.selectedId)) state.selectedId = null;
};

// Pushes a history entry. `key` collapses a burst of related edits (dragging a
// layer, sliding opacity) into a single undo step instead of hundreds.
const record = (state, key = null) => {
  if (key && state.coalesceKey === key) return;
  state.past.push(snapshot(state));
  if (state.past.length > 50) state.past.shift();
  state.future = [];
  state.coalesceKey = key;
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCanvasSize(state, action) {
      record(state);
      const { width, height } = action.payload;
      state.canvas.width = Math.max(200, Math.min(4000, Math.round(width)));
      state.canvas.height = Math.max(100, Math.min(4000, Math.round(height)));
    },
    setCanvasFill(state, action) {
      record(state, 'canvas-fill');
      state.canvas.fill = action.payload;
    },
    setBackground(state, action) {
      record(state);
      // Photographs almost always need dimming before text is readable on top;
      // flat generated patterns do not.
      state.background = action.payload
        ? { overlay: action.payload.photo ? 0.45 : 0, overlayColor: '#000000', ...action.payload }
        : null;
    },
    setBackgroundOverlay(state, action) {
      if (!state.background) return;
      record(state, 'bg-overlay');
      Object.assign(state.background, action.payload);
    },
    addText: {
      prepare: (patch) => ({ payload: makeText(patch) }),
      reducer(state, action) {
        record(state);
        state.layers.push(action.payload);
        state.selectedId = action.payload.id;
      },
    },
    addImage: {
      prepare: (src, patch) => ({ payload: makeImage(src, patch) }),
      reducer(state, action) {
        record(state);
        state.layers.push(action.payload);
        state.selectedId = action.payload.id;
      },
    },
    addIcon: {
      prepare: (iconId, patch) => ({ payload: makeIcon(iconId, patch) }),
      reducer(state, action) {
        record(state);
        state.layers.push(action.payload);
        state.selectedId = action.payload.id;
      },
    },
    addCustomIcon: {
      prepare: (icon, patch) => ({ payload: makeCustomIcon(icon, patch) }),
      reducer(state, action) {
        record(state);
        state.layers.push(action.payload);
        state.selectedId = action.payload.id;
      },
    },
    addTerminal: {
      prepare: (patch) => ({ payload: makeTerminal(patch) }),
      reducer(state, action) {
        record(state);
        state.layers.push(action.payload);
        state.selectedId = action.payload.id;
      },
    },
    updateLayer(state, action) {
      const { id, patch, coalesce = true } = action.payload;
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return;
      record(state, coalesce ? `${id}:${Object.keys(patch).join(',')}` : null);
      const { shadow, box, ...rest } = patch;
      Object.assign(layer, rest);
      if (shadow) layer.shadow = { ...layer.shadow, ...shadow };
      if (box) layer.box = { ...layer.box, ...box };
    },
    // Swaps the artwork on an existing icon layer while keeping where it sits
    // and how it is styled. This is what makes a topology node feel like a
    // socket: select the node, pick another icon, and it changes in place
    // instead of landing somewhere else as a new layer.
    replaceIcon(state, action) {
      const { id, icon } = action.payload;
      const layer = state.layers.find((l) => l.id === id && l.type === 'icon');
      if (!layer) return;
      record(state);
      layer.iconId = icon.id;
      layer.svg = icon.svg || '';
      layer.src = icon.src || null;
      layer.mono = !!icon.mono;
      // Only a single-colour icon can carry a tint; a brand icon keeps its own.
      layer.tint = icon.mono ? layer.tint || '#e2e8f0' : null;
      layer.name = icon.name || layer.name;
      state.coalesceKey = null;
    },
    removeLayer(state, action) {
      record(state);
      state.layers = state.layers.filter((l) => l.id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = null;
    },
    duplicateLayer(state, action) {
      const i = state.layers.findIndex((l) => l.id === action.payload);
      if (i < 0) return;
      record(state);
      const copy = JSON.parse(JSON.stringify(state.layers[i]));
      copy.id = nanoid(8);
      copy.name = `${copy.name} (copy)`;
      copy.x += 24;
      copy.y += 24;
      state.layers.splice(i + 1, 0, copy);
      state.selectedId = copy.id;
    },
    // Array order is stacking order: the last item is drawn on top.
    moveLayer(state, action) {
      const { id, dir } = action.payload;
      const i = state.layers.findIndex((l) => l.id === id);
      const j = dir === 'forward' ? i + 1 : i - 1;
      if (i < 0 || j < 0 || j >= state.layers.length) return;
      record(state);
      [state.layers[i], state.layers[j]] = [state.layers[j], state.layers[i]];
    },
    // Moves every text layer to a shared edge so they line up as a block:
    // the same left edge, the same centre, or the same right edge. Widths have
    // to be measured against real font metrics, which a reducer cannot do, so
    // the caller passes them in (see measureTextWidths in utils/canvasUtils).
    // One record() call means the whole banner realigns in a single undo step.
    alignTextLayers(state, action) {
      const { align, widths } = action.payload;
      const texts = state.layers.filter((l) => l.type === 'text');
      if (!texts.length) return;
      record(state);
      const margin = Math.round(state.canvas.width * SAFE_AREA_X_RATIO);
      for (const layer of texts) {
        const w = widths[layer.id] ?? 0;
        if (align === 'left') layer.x = margin;
        else if (align === 'center') layer.x = Math.round((state.canvas.width - w) / 2);
        else layer.x = Math.round(state.canvas.width - margin - w);
        // A block moved to one side wants its own lines on that side too,
        // otherwise multi-line text stays ragged against the new edge.
        layer.align = align;
      }
      state.coalesceKey = null;
    },
    selectLayer(state, action) {
      state.selectedId = action.payload;
      state.coalesceKey = null;
    },
    toggleGrid(state) {
      state.showGrid = !state.showGrid;
    },
    toggleSafeArea(state) {
      state.showSafeArea = !state.showSafeArea;
    },
    setExportSettings(state, action) {
      Object.assign(state.exportSettings, action.payload);
    },
    applyTemplate(state, action) {
      record(state);
      const { background, layers, canvas } = action.payload;
      if (canvas) state.canvas = { ...state.canvas, ...canvas };
      state.background = background;
      state.layers = layers;
      state.selectedId = null;
      state.coalesceKey = null;
    },
    resetBanner(state) {
      record(state);
      Object.assign(state, freshState());
      state.coalesceKey = null;
    },
    undo(state) {
      const prev = state.past.pop();
      if (!prev) return;
      state.future.push(snapshot(state));
      restore(state, prev);
      state.coalesceKey = null;
    },
    redo(state) {
      const next = state.future.pop();
      if (!next) return;
      state.past.push(snapshot(state));
      restore(state, next);
      state.coalesceKey = null;
    },
    hydrate(state, action) {
      const saved = action.payload;
      if (!saved) return;
      state.canvas = { ...DEFAULT_CANVAS, ...saved.canvas };
      state.background = saved.background ?? null;
      state.layers = Array.isArray(saved.layers) ? saved.layers : state.layers;
      state.exportSettings = { ...state.exportSettings, ...saved.exportSettings };
      state.selectedId = null;
      state.past = [];
      state.future = [];
    },
  },
});

export const {
  alignTextLayers,
  replaceIcon,
  setCanvasSize,
  setCanvasFill,
  setBackground,
  setBackgroundOverlay,
  addText,
  addImage,
  addIcon,
  addCustomIcon,
  addTerminal,
  updateLayer,
  removeLayer,
  duplicateLayer,
  moveLayer,
  selectLayer,
  toggleGrid,
  toggleSafeArea,
  setExportSettings,
  applyTemplate,
  resetBanner,
  undo,
  redo,
  hydrate,
} = editorSlice.actions;

export default editorSlice.reducer;
