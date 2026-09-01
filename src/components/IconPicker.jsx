// The icon library: search and category filter across the built-in set plus
// the user's own, and the form for adding more (upload a file or paste SVG).
//
// Clicking an icon drops it on the banner; successive drops step along a grid
// so several clicks stay visible instead of stacking on one spot. Added icons
// live in the icons slice and are saved along with the banner.

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICONS, ICON_CATEGORIES, iconDataUri, searchIcons } from '../data/icons';
import { addCustom, removeCustom } from '../features/icons/iconsSlice';
import { addIcon, addCustomIcon, replaceIcon } from '../features/editor/editorSlice';

const inputCls =
  'w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none';

const chip = (active) =>
  `rounded-full border px-2 py-0.5 text-[11px] ${
    active
      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
  }`;

// Pasted markup is stored as a data URI rather than injected into the page, so
// it renders in an <img> and cannot execute any script it happens to contain.
const svgToDataUri = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

export default function IconPicker() {
  const dispatch = useDispatch();
  const custom = useSelector((s) => s.icons.custom);
  const placedIcons = useSelector((s) => s.editor.layers.filter((l) => l.type === 'icon').length);
  // With an icon layer selected, the picker swaps that layer rather than adding
  // another — which is how a template's node gets changed for your own tool.
  const selected = useSelector((s) => s.editor.layers.find((l) => l.id === s.editor.selectedId));
  const swapping = selected?.type === 'icon' ? selected : null;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });
  const [formError, setFormError] = useState(null);

  const categories = useMemo(
    () => ['All', ...ICON_CATEGORIES, ...(custom.length ? ['My icons'] : [])],
    [custom.length]
  );

  const results = useMemo(
    () => searchIcons([...custom, ...ICONS], query, category),
    [custom, query, category]
  );

  const place = (icon) => {
    if (swapping) {
      dispatch(replaceIcon({ id: swapping.id, icon }));
      return;
    }
    // Lay new icons out in a row so several clicks in a row stay visible
    // instead of piling up on the same spot.
    const spot = { x: 120 + (placedIcons % 8) * 96, y: 250 + Math.floor(placedIcons / 8) * 96 };
    if (icon.custom) dispatch(addCustomIcon(icon, spot));
    else dispatch(addIcon(icon.id, spot));
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      dispatch(
        addCustom({ name: form.name || file.name.replace(/\.[^.]+$/, ''), src: reader.result })
      );
    reader.readAsDataURL(file);
    e.target.value = '';
    setForm({ name: '', code: '' });
    setAdding(false);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const code = form.code.trim();
    if (!code.startsWith('<svg')) {
      setFormError('That does not look like SVG code — it should start with <svg.');
      return;
    }
    setFormError(null);
    dispatch(addCustom({ name: form.name, src: svgToDataUri(code) }));
    setForm({ name: '', code: '' });
    setAdding(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold">Icons</h2>
      {swapping ? (
        <p className="mb-3 mt-1 rounded border border-cyan-800 bg-cyan-950/50 px-2 py-1.5 text-[11px] leading-relaxed text-cyan-200">
          Replacing <strong className="font-semibold">{swapping.name}</strong> — click any icon and
          it takes its place, same spot and size. Click the banner background to stop.
        </p>
      ) : (
        <p className="mb-3 mt-1 text-[11px] text-slate-400">
          Click any icon to drop it on the banner, then drag it where you want. Select an icon
          already on the banner first to swap that one instead.
        </p>
      )}

      <input
        className={`${inputCls} mb-2`}
        placeholder="Search: python, docker, cisco, sql…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search icons"
      />

      <div className="mb-3 flex flex-wrap gap-1">
        {categories.map((c) => (
          <button key={c} className={chip(c === category)} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4">
        {results.map((icon) => (
          <div key={icon.id} className="relative">
            <button
              onClick={() => place(icon)}
              title={`Add ${icon.name}`}
              className="flex w-full flex-col items-center gap-1 rounded border border-slate-800 bg-slate-900 p-2 hover:border-cyan-500"
            >
              <img
                src={icon.src || iconDataUri(icon.svg, icon.mono ? '#e2e8f0' : null)}
                alt=""
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
              <span className="w-full truncate text-center text-[9px] leading-tight text-slate-400">
                {icon.name}
              </span>
            </button>
            {icon.custom && (
              <button
                onClick={() => dispatch(removeCustom(icon.id))}
                title="Delete this icon from my library"
                className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-slate-700 text-[10px] leading-none text-slate-200 hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p className="py-4 text-center text-xs text-slate-500">
          Nothing matched “{query}”. You can add your own icon below.
        </p>
      )}

      <div className="mt-4 border-t border-slate-800 pt-3">
        {!adding ? (
          <button
            className="w-full rounded border border-dashed border-slate-600 p-3 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
            onClick={() => setAdding(true)}
          >
            + Add your own icon
          </button>
        ) : (
          <form onSubmit={onPaste} className="space-y-2">
            <input
              className={inputCls}
              placeholder="Icon name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label className="block cursor-pointer rounded border border-dashed border-slate-600 p-2 text-center text-[11px] text-slate-300 hover:border-cyan-500">
              Upload a file (SVG, PNG, JPG)
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
            <p className="text-center text-[10px] text-slate-500">or paste SVG code</p>
            <textarea
              rows={3}
              className={`${inputCls} font-mono text-[11px]`}
              placeholder="&lt;svg viewBox=&quot;0 0 24 24&quot;&gt;…&lt;/svg&gt;"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            {formError && <p className="text-[11px] text-red-400">{formError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded bg-cyan-600 py-1 text-xs font-medium text-white hover:bg-cyan-500"
              >
                Save icon
              </button>
              <button
                type="button"
                className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
                onClick={() => {
                  setAdding(false);
                  setFormError(null);
                }}
              >
                Cancel
              </button>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Tip: sites like simpleicons.org or svgrepo.com let you copy an icon as SVG code.
              Everything you add stays in your browser.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
