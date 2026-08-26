// Everything on the banner, topmost first. Clicking a row selects that layer
// for the properties panel; the row buttons restack and delete it.

import { useDispatch, useSelector } from 'react-redux';
import { moveLayer, selectLayer, removeLayer } from '../features/editor/editorSlice';

const iconBtn =
  'grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 text-xs text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30';

// One-glyph type marker, so a row stays readable in a 288px-wide panel.
const TYPE_BADGE = { text: 'T', image: '🖼', icon: '★', terminal: '>_' };

function summary(layer) {
  if (layer.type === 'text') return layer.text.split('\n')[0];
  if (layer.type === 'terminal') return layer.lines.split('\n')[0];
  return layer.type;
}

export default function LayerList() {
  const dispatch = useDispatch();
  const { layers, selectedId } = useSelector((s) => s.editor);
  // The last array item is drawn on top, so show it first.
  const ordered = [...layers].reverse();

  return (
    <div className="p-4">
      <h2 className="mb-2 text-sm font-semibold">Layers</h2>
      {ordered.length === 0 && (
        <p className="text-xs text-slate-500">
          Nothing on the banner yet. Use the buttons in the top bar to add text or icons.
        </p>
      )}
      <ul className="space-y-1">
        {ordered.map((l, idx) => (
          <li key={l.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => dispatch(selectLayer(l.id))}
              onKeyDown={(e) => e.key === 'Enter' && dispatch(selectLayer(l.id))}
              className={`flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-xs ${
                l.id === selectedId
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <span aria-hidden className="w-4 shrink-0 text-center text-slate-400">
                {TYPE_BADGE[l.type]}
              </span>
              <span className="min-w-0 flex-1 truncate text-slate-200">
                {l.name}
                <span className="text-slate-500"> — {summary(l)}</span>
              </span>
              <button
                className={iconBtn}
                title="Bring forward"
                disabled={idx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(moveLayer({ id: l.id, dir: 'forward' }));
                }}
              >
                ↑
              </button>
              <button
                className={iconBtn}
                title="Send backward"
                disabled={idx === ordered.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(moveLayer({ id: l.id, dir: 'backward' }));
                }}
              >
                ↓
              </button>
              <button
                className="grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 text-xs text-slate-400 hover:bg-red-900 hover:text-white"
                title="Delete layer"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeLayer(l.id));
                }}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
