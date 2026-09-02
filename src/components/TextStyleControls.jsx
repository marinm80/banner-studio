// Styles every text layer on the banner at once: typeface, weight, slant and
// alignment. Acts on the whole banner rather than the selected layer, because
// a banner reads better when its text agrees with itself — the per-layer
// versions of these live in the properties panel for when it should not.

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alignTextLayers, styleAllText } from '../features/editor/editorSlice';
import { measureTextWidths } from '../utils/canvasUtils';
import { FONTS, FONT_GROUPS, fontGroup } from '../utils/fonts';

const ALIGNMENTS = [
  ['left', 'Left', '⇤'],
  ['center', 'Center', '↔'],
  ['right', 'Right', '⇥'],
];

const btn = (active) =>
  `flex flex-1 items-center justify-center gap-1.5 rounded border px-2 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
      : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-cyan-500 hover:text-cyan-300'
  }`;

export default function TextStyleControls() {
  const dispatch = useDispatch();
  const layers = useSelector((s) => s.editor.layers);
  const [busy, setBusy] = useState(false);

  const texts = layers.filter((l) => l.type === 'text');
  const none = texts.length === 0;
  // A toggle only reads as "on" when the whole banner is in that state.
  const allBold = !none && texts.every((l) => l.weight >= 700);
  const allItalic = !none && texts.every((l) => l.italic);
  // Blank when the layers disagree, so the select never lies about them.
  const sharedFont = !none && texts.every((l) => l.font === texts[0].font) ? texts[0].font : '';

  // Right and centre need each layer's real rendered width, and measuring waits
  // on the webfonts, so this is async — hence the busy guard against a double
  // tap landing two undo steps.
  const align = async (dir) => {
    if (busy || none) return;
    setBusy(true);
    try {
      const widths = await measureTextWidths(layers);
      dispatch(alignTextLayers({ align: dir, widths }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-b border-slate-800 p-4">
      <h2 className="mb-2 text-sm font-semibold">All text</h2>

      <label className="mb-2 block text-[11px] text-slate-400">
        Typeface
        <select
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
          value={sharedFont}
          disabled={none}
          onChange={(e) => dispatch(styleAllText({ font: e.target.value }))}
        >
          {sharedFont === '' && <option value="">— mixed —</option>}
          {FONT_GROUPS.map((group) => {
            const inGroup = FONTS.filter((f) => fontGroup(f) === group);
            if (!inGroup.length) return null;
            return (
              <optgroup key={group} label={group}>
                {inGroup.map((f) => (
                  <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                    {f.family}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </label>

      <div className="mb-2 flex gap-1">
        <button
          className={btn(allBold)}
          disabled={none}
          aria-pressed={allBold}
          onClick={() => dispatch(styleAllText({ weight: allBold ? 400 : 700 }))}
        >
          <span aria-hidden className="font-bold">
            B
          </span>
          Bold
        </button>
        <button
          className={btn(allItalic)}
          disabled={none}
          aria-pressed={allItalic}
          onClick={() => dispatch(styleAllText({ italic: !allItalic }))}
        >
          <span aria-hidden className="italic">
            I
          </span>
          Italic
        </button>
      </div>

      <div className="flex gap-1">
        {ALIGNMENTS.map(([id, label, glyph]) => (
          <button
            key={id}
            onClick={() => align(id)}
            disabled={busy || none}
            className={btn(false)}
            title={`Line every text layer up on the ${label.toLowerCase()}`}
          >
            <span aria-hidden className="text-sm leading-none">
              {glyph}
            </span>
            {label}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        {none
          ? 'Add some text to the banner first.'
          : 'Applies to every text layer at once — one undo step each. Changing the typeface or the weight changes how wide the text is, so align again afterwards to re-square the edges.'}
      </p>
    </div>
  );
}
