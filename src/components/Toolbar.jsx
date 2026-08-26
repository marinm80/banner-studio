// The top bar: add a layer, undo/redo, the view toggles, the banner size and
// Download. Dispatches straight to the editor slice; the modals it opens are
// owned by App.
//
// One set of buttons serves both layouts. At xl everything sits inline; below
// that the add buttons drop to a row of their own and the secondary controls
// move into the "⋯" menu, so the header never pushes the page sideways.

import { useEffect, useRef, useState } from 'react';
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

const toggle = (active) => `${btn} ${active ? 'border-cyan-500 text-cyan-300' : ''}`;

// Capped below 2xl so the preset name truncates instead of wrapping the whole
// header onto a second row on a 1280-wide laptop.
const selectCls =
  'max-w-[13rem] rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none 2xl:max-w-none';

export default function Toolbar({ onExport, onHelp, onOpenIcons }) {
  const dispatch = useDispatch();
  const { showGrid, showSafeArea, canvas, past, future } = useSelector((s) => s.editor);
  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Dismiss the overflow menu on an outside tap or on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(addImage(reader.result, { name: file.name }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // The dropdown reflects the canvas rather than owning it, since the size can
  // also be typed in by hand — hence the extra "custom" option when the current
  // dimensions match no preset.
  const presetId =
    CANVAS_PRESETS.find((p) => p.width === canvas.width && p.height === canvas.height)?.id ||
    'custom';

  const startOver = () => {
    if (confirm('Start over? This clears the current banner.')) dispatch(resetBanner());
  };

  // Rendered twice: inline on a wide screen, on its own row on a narrow one.
  // Four buttons only fit across a phone once this one drops its full label.
  const addButtons = (
    <>
      <button className={btn} onClick={() => dispatch(addText())}>
        + Text
      </button>
      <button className={btn} onClick={onOpenIcons}>
        + Icon
      </button>
      <button className={btn} onClick={() => dispatch(addTerminal())}>
        + Te<span className="sm:hidden">rm</span>
        <span className="hidden sm:inline">rminal</span>
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>
        + Photo
      </button>
    </>
  );

  const sizeSelect = (
    <select
      className={selectCls}
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
  );

  return (
    <header className="shrink-0 border-b border-slate-800 bg-slate-900 px-2 py-2 xl:px-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <h1 className="mr-1 shrink-0 text-sm font-bold tracking-tight xl:mr-2">
          ⚡<span className="hidden sm:inline"> Banner Studio</span>
          <span className="ml-1.5 hidden font-normal text-slate-400 2xl:inline">
            · design your profile banner
          </span>
        </h1>

        <div className="hidden items-center gap-1.5 xl:flex">
          {addButtons}
          <span className="mx-1 h-5 w-px bg-slate-700" />
        </div>

        <button
          className={btn}
          disabled={!past.length}
          onClick={() => dispatch(undo())}
          title="Undo"
          aria-label="Undo"
        >
          ↶<span className="hidden xl:inline"> Undo</span>
        </button>
        <button
          className={btn}
          disabled={!future.length}
          onClick={() => dispatch(redo())}
          title="Redo"
          aria-label="Redo"
        >
          ↷<span className="hidden xl:inline"> Redo</span>
        </button>

        <div className="hidden items-center gap-1.5 xl:flex">
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
          {sizeSelect}
        </div>

        <div className="flex-1" />

        <div className="hidden items-center gap-1.5 xl:flex">
          <button className={btn} onClick={startOver}>
            Start over
          </button>
          <button className={btn} onClick={onHelp}>
            ? Help
          </button>
        </div>

        {/* Everything the wide layout shows inline lives in here below lg. */}
        <div className="relative xl:hidden" ref={menuRef}>
          <button
            className={btn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="More options"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-60 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-2xl">
              <div className="mb-2 grid grid-cols-2 gap-1.5">
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
                >
                  Safe area
                </button>
              </div>
              <label className="mb-2 block text-[11px] text-slate-400">
                Banner size
                <div className="mt-1 [&>select]:w-full">{sizeSelect}</div>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  className={btn}
                  onClick={() => {
                    setMenuOpen(false);
                    onHelp();
                  }}
                >
                  ? Help
                </button>
                <button
                  className={btn}
                  onClick={() => {
                    setMenuOpen(false);
                    startOver();
                  }}
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="shrink-0 rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 xl:px-4"
          onClick={onExport}
        >
          Download
        </button>
      </div>

      {/* On a narrow screen the add buttons get a row of their own rather than
          wrapping the whole header into five lines. */}
      <div className="mt-1.5 flex gap-1.5 xl:hidden [&>button]:flex-1 [&>button]:whitespace-nowrap [&>button]:px-1 sm:[&>button]:flex-none sm:[&>button]:px-2.5">
        {addButtons}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </header>
  );
}
