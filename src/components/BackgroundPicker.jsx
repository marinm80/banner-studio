// Background chooser: the catalog with search, paging and a dimming slider,
// plus solid colors, an upload and a paste-a-link field.
//
// Catalog state (theme, page, results) lives in the backgrounds slice; the
// chosen background is written to the editor slice. A remote image has to be
// readable cross-origin or the canvas export cannot produce a downloadable
// file — which is why the copy nudges people to upload when a link fails.

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBackgrounds, setTheme, setPage } from '../features/backgrounds/backgroundsSlice';
import { setBackground, setBackgroundOverlay } from '../features/editor/editorSlice';

const THEMES = [
  'all',
  'photos',
  'technology',
  'atc',
  'web development',
  'cloud computing',
  'network support services',
  'database application development',
  'code',
  'linux',
  'commands',
  'circuits',
  'network',
  'matrix',
  'neon',
  'blueprint',
  'general',
  'minimal',
  'waves',
  'bokeh',
  'light',
];

const SOLIDS = ['#0f172a', '#111827', '#1e293b', '#0b2545', '#111111', '#f8fafc', '#e2e8f0', '#1d4ed8', '#0d9488', '#7c3aed'];

const inputCls =
  'w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none';

const chip = (active) =>
  `rounded-full border px-2 py-0.5 text-[11px] ${
    active
      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
  }`;

const pagerBtn =
  'rounded border border-slate-700 px-2 py-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';

export default function BackgroundPicker() {
  const dispatch = useDispatch();
  const { theme, page, limit, total, items, status, error } = useSelector((s) => s.backgrounds);
  const background = useSelector((s) => s.editor.background);
  const [query, setQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    dispatch(loadBackgrounds({ theme, page, limit }));
  }, [dispatch, theme, page, limit]);

  const pages = Math.max(1, Math.ceil(total / limit));

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(setBackground({ source: 'upload', url: reader.result, photo: true }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold">Backgrounds</h2>
      <p className="mb-3 mt-1 text-[11px] text-slate-400">
        Search a topic, pick a solid color, or upload your own image.
      </p>

      {/* Searching and picking a chip are the same action: the catalog treats a
          free-text topic as just another theme, so both set `theme`. */}
      <form
        className="mb-2 flex gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setTheme(query.trim() || 'all'));
        }}
      >
        <input
          className={inputCls}
          placeholder="Search a topic…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search backgrounds by topic"
        />
        <button className="rounded bg-cyan-600 px-3 text-sm text-white hover:bg-cyan-500">Go</button>
      </form>

      <div className="mb-3 flex flex-wrap gap-1">
        {THEMES.map((t) => (
          <button
            key={t}
            className={chip(t === theme)}
            onClick={() => {
              setQuery(t === 'all' ? '' : t);
              dispatch(setTheme(t));
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="py-6 text-center text-xs text-slate-500">Loading backgrounds…</div>
      )}
      {status === 'failed' && (
        <div className="py-2 text-center text-xs text-red-400">Error: {error}</div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
        {items.map((b) => (
          <button
            key={b.id}
            title={b.credit ? `${b.label} — ${b.credit}` : b.label}
            onClick={() =>
              dispatch(
                setBackground({
                  source: 'api',
                  id: b.id,
                  url: b.url,
                  photo: b.theme === 'photo',
                  credit: b.credit,
                })
              )
            }
            className={`overflow-hidden rounded border text-left ${
              background?.id === b.id
                ? 'border-cyan-400 ring-1 ring-cyan-400'
                : 'border-slate-700 hover:border-slate-400'
            }`}
          >
            <img
              src={b.thumbnailUrl}
              alt={b.label}
              loading="lazy"
              className="aspect-[3/1] w-full object-cover"
            />
            {b.credit && (
              <span className="block truncate px-1 py-0.5 text-[9px] text-slate-500">
                {b.credit}
              </span>
            )}
          </button>
        ))}
      </div>

      {status === 'succeeded' && total === 0 && (
        <p className="py-4 text-center text-xs text-slate-500">
          No results for “{theme}”. Try another topic.
        </p>
      )}

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <button className={pagerBtn} disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}>
          ← Prev
        </button>
        <span>
          {page} / {pages} · {total} backgrounds
        </span>
        <button
          className={pagerBtn}
          disabled={page >= pages}
          onClick={() => dispatch(setPage(page + 1))}
        >
          Next →
        </button>
      </div>

      {background?.url && (
        <div className="mt-4 border-t border-slate-800 pt-3">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Dim the background · {Math.round((background.overlay || 0) * 100)}%
          </p>
          <p className="mb-2 text-[10px] leading-relaxed text-slate-500">
            Darken the picture so your name stands out. Photos usually need this.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="0.85"
              step="0.05"
              className="w-full accent-cyan-500"
              value={background.overlay || 0}
              onChange={(e) => dispatch(setBackgroundOverlay({ overlay: +e.target.value }))}
              aria-label="Background dimming"
            />
            <input
              type="color"
              className="h-7 w-9 shrink-0 cursor-pointer rounded border border-slate-700 bg-slate-800"
              value={background.overlayColor || '#000000'}
              onChange={(e) => dispatch(setBackgroundOverlay({ overlayColor: e.target.value }))}
              aria-label="Dimming color"
            />
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-slate-800 pt-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Solid color
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SOLIDS.map((c) => (
            <button
              key={c}
              title={c}
              aria-label={`Solid background ${c}`}
              onClick={() => dispatch(setBackground({ source: 'color', color: c }))}
              className={`h-7 w-7 rounded border ${
                background?.source === 'color' && background.color === c
                  ? 'border-cyan-400 ring-1 ring-cyan-400'
                  : 'border-slate-600 hover:border-slate-300'
              }`}
              style={{ background: c }}
            />
          ))}
          <label
            className="grid h-7 w-7 cursor-pointer place-items-center rounded border border-dashed border-slate-500 text-xs text-slate-300 hover:border-cyan-500"
            title="Custom color"
          >
            +
            <input
              type="color"
              className="sr-only"
              onChange={(e) => dispatch(setBackground({ source: 'color', color: e.target.value }))}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-3">
        <label className="block cursor-pointer rounded border border-dashed border-slate-600 p-3 text-center text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300">
          Upload your own background (JPG / PNG)
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>

        <form
          className="mt-2 flex gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            const url = imageUrl.trim();
            if (!/^https?:\/\//i.test(url)) return;
            dispatch(setBackground({ source: 'url', url, photo: true }));
            setImageUrl('');
          }}
        >
          <input
            className={inputCls}
            placeholder="…or paste an image link"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            aria-label="Background image URL"
          />
          <button className="rounded bg-slate-700 px-3 text-sm text-white hover:bg-slate-600">
            Use
          </button>
        </form>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
          Works with any picture the site allows other sites to use — Unsplash links do. If it does
          not load, download the picture and upload it above.
        </p>
        {(background?.source === 'upload' || background?.source === 'url') && (
          <p className="mt-1 text-[11px] text-emerald-400">Using your own image ✓</p>
        )}
        {background && (
          <button
            className="mt-2 w-full rounded border border-slate-700 px-2 py-1 text-[11px] text-slate-400 hover:border-slate-500 hover:text-slate-200"
            onClick={() => dispatch(setBackground(null))}
          >
            Remove background
          </button>
        )}
      </div>
    </div>
  );
}
