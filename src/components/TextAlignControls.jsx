// Aligns every text layer on the banner at once — one shared left edge, one
// shared centre, or one shared right edge — rather than nudging each layer by
// hand. Acts on the whole banner, so it sits with the other banner-wide
// controls rather than in the per-layer properties panel.

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alignTextLayers } from '../features/editor/editorSlice';
import { measureTextWidths } from '../utils/canvasUtils';

const OPTIONS = [
  ['left', 'Left', '⇤'],
  ['center', 'Center', '↔'],
  ['right', 'Right', '⇥'],
];

export default function TextAlignControls() {
  const dispatch = useDispatch();
  const layers = useSelector((s) => s.editor.layers);
  const [busy, setBusy] = useState(false);
  const textCount = layers.filter((l) => l.type === 'text').length;

  // Right and centre need each layer's real rendered width, and measuring waits
  // on the webfonts, so this is async — hence the busy guard against a double
  // tap landing two undo steps.
  const apply = async (align) => {
    if (busy || !textCount) return;
    setBusy(true);
    try {
      const widths = await measureTextWidths(layers);
      dispatch(alignTextLayers({ align, widths }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-b border-slate-800 p-4">
      <h2 className="mb-2 text-sm font-semibold">Align all text</h2>
      <div className="flex gap-1">
        {OPTIONS.map(([id, label, glyph]) => (
          <button
            key={id}
            onClick={() => apply(id)}
            disabled={busy || !textCount}
            title={`Line every text layer up on the ${label.toLowerCase()}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-slate-200 hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden className="text-sm leading-none">
              {glyph}
            </span>
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        {textCount
          ? 'Moves every text layer to the same edge so they line up as a block, just inside the safe area. Undo puts it all back in one step.'
          : 'Add some text to the banner first.'}
      </p>
    </div>
  );
}
