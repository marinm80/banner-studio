import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addText,
  addImage,
  addTerminal,
  toggleGrid,
  toggleSafeArea,
  setCanvasSize,
  resetBanner,
  undo,
  redo,
  CANVAS_PRESETS,
} from '../features/editor/editorSlice';

const btn =
  'rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-35';

const toggle = (active) =>
  `${btn} ${active ? 'border-cyan-500 text-cyan-300' : ''}`;

export default function Toolbar({ onExport, onHelp, onOpenIcons }) {
  const dispatch = useDispatch();
  const { showGrid, showSafeArea, canvas, past, future } = useSelector((s) => s.editor);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(addImage(reader.result, { name: file.name }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const presetId =
    CANVAS_PRESETS.find((p) => p.width === canvas.width && p.height === canvas.height)?.id ||
    'custom';

  return (
    <header className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-4 py-2">
      <h1 className="mr-2 text-sm font-bold tracking-tight">
        ⚡ Banner Studio
        <span className="ml-1.5 hidden font-normal text-slate-400 sm:inline">
          · design your profile banner
        </span>
      </h1>

      <button className={btn} onClick={() => dispatch(addText())}>
        + Text
      </button>
      <button className={btn} onClick={onOpenIcons}>
        + Icon
      </button>
      <button className={btn} onClick={() => dispatch(addTerminal())}>
        + Terminal
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>
        + Photo
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      <span className="mx-1 h-5 w-px bg-slate-700" />

      <button className={btn} disabled={!past.length} onClick={() => dispatch(undo())} title="Undo">
        ↶ Undo
      </button>
      <button className={btn} disabled={!future.length} onClick={() => dispatch(redo())} title="Redo">
        ↷ Redo
      </button>

      <span className="mx-1 h-5 w-px bg-slate-700" />

      <button
        className={toggle(showGrid)}
        onClick={() => dispatch(toggleGrid())}
        aria-pressed={showGrid}
      >
        Grid
      </button>
      <button
        className={toggle(showSafeArea)}
        onClick={() => dispatch(toggleSafeArea())}
        aria-pressed={showSafeArea}
        title="Show the area LinkedIn keeps visible on every device"
      >
        Safe area
      </button>

      <select
        className="rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
        value={presetId}
        onChange={(e) => {
          const preset = CANVAS_PRESETS.find((p) => p.id === e.target.value);
          if (preset) dispatch(setCanvasSize({ width: preset.width, height: preset.height }));
        }}
        aria-label="Banner size"
      >
        {CANVAS_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label} · {p.width}×{p.height}
          </option>
        ))}
        {presetId === 'custom' && (
          <option value="custom">
            Custom · {canvas.width}×{canvas.height}
          </option>
        )}
      </select>

      <div className="flex-1" />

      <button
        className={btn}
        onClick={() => {
          if (confirm('Start over? This clears the current banner.')) dispatch(resetBanner());
        }}
      >
        Start over
      </button>
      <button className={btn} onClick={onHelp}>
        ? Help
      </button>
      <button
        className="rounded bg-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500"
        onClick={onExport}
      >
        Download
      </button>
    </header>
  );
}
