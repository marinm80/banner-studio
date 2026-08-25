import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExportSettings } from '../features/editor/editorSlice';
import useCanvasExport from '../hooks/useCanvasExport';

const inputCls =
  'w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none';

export default function ExportModal({ onClose }) {
  const dispatch = useDispatch();
  const { canvas, background, layers, exportSettings } = useSelector((s) => s.editor);
  const { quality, filename, format } = exportSettings;
  const { toDataUrl, download, busy, error } = useCanvasExport();
  const [preview, setPreview] = useState(null);

  // Regenerate the preview (debounced) whenever the design or the settings change.
  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      toDataUrl({ canvas, background, layers, quality, format })
        .then((url) => {
          if (alive) setPreview(url);
        })
        .catch(() => {});
    }, 200);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [canvas, background, layers, quality, format, toDataUrl]);

  const warnings = [];
  if (!background) warnings.push('No background chosen — the banner will use a solid color.');
  if (!layers.some((l) => l.type === 'text' && l.text.trim()))
    warnings.push('There is no text on this banner yet.');
  if (layers.some((l) => l.type === 'text' && /your name/i.test(l.text)))
    warnings.push('One layer still says “Your Name” — remember to put yours in.');

  const sizeKb = preview
    ? Math.round(((preview.length - preview.indexOf(',') - 1) * 0.75) / 1024)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Download banner"
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Download · {canvas.width}×{canvas.height}
          </h2>
          <button className="text-slate-400 hover:text-white" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mb-3 overflow-hidden rounded border border-slate-700 bg-slate-950">
          {preview ? (
            <img src={preview} alt="Banner preview" className="w-full" />
          ) : (
            <div className="grid aspect-[4/1] place-items-center text-xs text-slate-500">
              Building preview…
            </div>
          )}
        </div>

        {warnings.map((w) => (
          <p key={w} className="mb-1 rounded bg-amber-950/60 px-2 py-1 text-xs text-amber-300">
            ⚠ {w}
          </p>
        ))}
        {error && <p className="mb-1 text-xs text-red-400">{error}</p>}

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="text-xs text-slate-400">
            File name
            <input
              className={`${inputCls} mt-1`}
              value={filename}
              onChange={(e) => dispatch(setExportSettings({ filename: e.target.value }))}
            />
          </label>
          <label className="text-xs text-slate-400">
            Format
            <select
              className={`${inputCls} mt-1`}
              value={format}
              onChange={(e) => dispatch(setExportSettings({ format: e.target.value }))}
            >
              <option value="jpeg">JPEG — smaller file</option>
              <option value="png">PNG — sharper text</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">
            {format === 'jpeg'
              ? `Quality · ${Math.round(quality * 100)}%`
              : 'Quality · lossless'}
            {sizeKb ? <span className="text-slate-500"> (~{sizeKb} KB)</span> : null}
            <input
              type="range"
              min="0.6"
              max="1"
              step="0.02"
              disabled={format === 'png'}
              className="mt-3 w-full accent-cyan-500 disabled:opacity-40"
              value={quality}
              onChange={(e) => dispatch(setExportSettings({ quality: +e.target.value }))}
            />
          </label>
        </div>

        <p className="mt-3 rounded bg-slate-800/60 px-3 py-2 text-[11px] leading-relaxed text-slate-400">
          On LinkedIn: go to your profile → the camera icon on the cover image → upload this file.
          Anything close to the bottom-left may sit under your profile photo, so keep your name a
          little higher or to the right.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            disabled={busy || !preview}
            onClick={() => download(preview, filename.trim() || 'banner', format)}
          >
            {busy ? 'Working…' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
