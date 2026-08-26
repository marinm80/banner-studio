// Editor for the selected layer. Shows the fields for its type — text, image,
// icon or terminal — then the position, opacity and rotation controls every
// type shares, then reorder, duplicate and delete.
//
// Every control dispatches updateLayer. Continuous inputs coalesce into a
// single undo step; discrete ones pass coalesce=false so each click can be
// undone on its own.

import { useDispatch, useSelector } from 'react-redux';
import { updateLayer, removeLayer, duplicateLayer, moveLayer } from '../features/editor/editorSlice';
import { FONTS } from '../utils/fonts';

const inputCls =
  'w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none';

const actionBtn =
  'rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-slate-300 hover:border-slate-500 hover:text-white';

function Row({ label, children, hint }) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-slate-500">{hint}</span>}
    </label>
  );
}

function Color({ value, onChange }) {
  return (
    <input
      type="color"
      className="h-8 w-full cursor-pointer rounded border border-slate-700 bg-slate-800"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Slider({ min, max, step = 1, value, onChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      className="w-full accent-cyan-500"
      value={value}
      onChange={(e) => onChange(+e.target.value)}
    />
  );
}

export default function PropertiesPanel() {
  const dispatch = useDispatch();
  const { layers, selectedId } = useSelector((s) => s.editor);
  const layer = layers.find((l) => l.id === selectedId);

  if (!layer) {
    return (
      <div className="border-t border-slate-800 p-4 text-xs leading-relaxed text-slate-500">
        Select a layer — on the banner or in the list above — to edit it.
        <br />
        <span className="text-slate-600">
          Tip: arrow keys nudge the selected layer, Shift + arrows move it faster.
        </span>
      </div>
    );
  }

  // coalesce=true merges a run of edits to the same field into one undo step,
  // which is what you want while dragging a slider or typing. Discrete choices
  // (an alignment button, a backdrop shape) pass false so each is its own step.
  const set = (patch, coalesce = true) => dispatch(updateLayer({ id: layer.id, patch, coalesce }));
  const setShadow = (patch) => set({ shadow: patch });
  const setBox = (patch) => set({ box: patch });

  return (
    <div className="border-t border-slate-800 p-4">
      <h2 className="mb-3 text-sm font-semibold">Properties</h2>

      <Row label="Layer name">
        <input className={inputCls} value={layer.name} onChange={(e) => set({ name: e.target.value })} />
      </Row>

      {layer.type === 'text' && (
        <>
          <Row label="Text">
            <textarea
              rows={2}
              className={inputCls}
              value={layer.text}
              onChange={(e) => set({ text: e.target.value })}
            />
          </Row>
          <Row label="Font">
            <select className={inputCls} value={layer.font} onChange={(e) => set({ font: e.target.value })}>
              {FONTS.map((f) => (
                <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                  {f.family}
                </option>
              ))}
            </select>
          </Row>
          <div className="grid grid-cols-2 gap-2">
            <Row label="Size (px)">
              <input
                type="number"
                min="8"
                max="400"
                className={inputCls}
                value={layer.size}
                onChange={(e) => set({ size: Math.max(8, +e.target.value || 8) })}
              />
            </Row>
            <Row label="Color">
              <Color value={layer.color} onChange={(color) => set({ color })} />
            </Row>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Row label="Weight">
              <select
                className={inputCls}
                value={layer.weight}
                onChange={(e) => set({ weight: +e.target.value })}
              >
                <option value={400}>Normal</option>
                <option value={700}>Bold</option>
              </select>
            </Row>
            <Row label="Align">
              <div className="flex gap-1">
                {[
                  ['left', 'Left'],
                  ['center', 'Center'],
                  ['right', 'Right'],
                ].map(([a, text]) => (
                  <button
                    key={a}
                    onClick={() => set({ align: a }, false)}
                    className={`flex-1 rounded border px-1 py-1 text-xs ${
                      layer.align === a
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </Row>
          </div>
        </>
      )}

      {layer.type === 'image' && (
        <div className="grid grid-cols-2 gap-2">
          <Row label={`Width (${layer.width} px)`}>
            <Slider min={40} max={1200} value={layer.width} onChange={(width) => set({ width })} />
          </Row>
          <Row label={`Corner radius (${layer.radius})`}>
            <Slider min={0} max={200} value={layer.radius} onChange={(radius) => set({ radius })} />
          </Row>
        </div>
      )}

      {layer.type === 'icon' && (
        <>
          <Row label={`Size (${layer.size} px)`}>
            <Slider min={24} max={400} value={layer.size} onChange={(size) => set({ size })} />
          </Row>
          {layer.mono && (
            <Row label="Icon color" hint="This icon is single-color, so you can recolor it.">
              <Color value={layer.tint || '#e2e8f0'} onChange={(tint) => set({ tint })} />
            </Row>
          )}
          <Row label="Backdrop">
            <div className="flex gap-1">
              {[
                ['none', 'None'],
                ['circle', 'Circle'],
                ['rounded', 'Square'],
              ].map(([b, text]) => (
                <button
                  key={b}
                  onClick={() => set({ badge: b }, false)}
                  className={`flex-1 rounded border px-1 py-1 text-xs ${
                    layer.badge === b
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
          </Row>
          {layer.badge !== 'none' && (
            <div className="grid grid-cols-2 gap-2">
              <Row label="Backdrop color">
                <Color value={layer.badgeColor} onChange={(badgeColor) => set({ badgeColor })} />
              </Row>
              <Row label={`Backdrop opacity (${Math.round(layer.badgeOpacity * 100)}%)`}>
                <Slider
                  min={0.02}
                  max={1}
                  step={0.02}
                  value={layer.badgeOpacity}
                  onChange={(badgeOpacity) => set({ badgeOpacity })}
                />
              </Row>
            </div>
          )}
        </>
      )}

      {layer.type === 'terminal' && (
        <>
          <Row
            label="Terminal lines"
            hint="One line each. Lines starting with $ are shown as commands."
          >
            <textarea
              rows={7}
              className={`${inputCls} font-mono text-[12px]`}
              value={layer.lines}
              onChange={(e) => set({ lines: e.target.value })}
            />
          </Row>
          <div className="grid grid-cols-2 gap-2">
            <Row label={`Width (${layer.width} px)`}>
              <Slider min={200} max={1400} value={layer.width} onChange={(width) => set({ width })} />
            </Row>
            <Row label={`Font size (${layer.fontSize} px)`}>
              <Slider
                min={10}
                max={44}
                value={layer.fontSize}
                onChange={(fontSize) => set({ fontSize, lineGap: Math.round(fontSize * 1.6) })}
              />
            </Row>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Row label="Command color">
              <Color value={layer.promptColor} onChange={(promptColor) => set({ promptColor })} />
            </Row>
            <Row label="Output color">
              <Color value={layer.textColor} onChange={(textColor) => set({ textColor })} />
            </Row>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Row label="Window color">
              <Color value={layer.bgColor} onChange={(bgColor) => set({ bgColor })} />
            </Row>
            <Row label="Border color">
              <Color value={layer.borderColor} onChange={(borderColor) => set({ borderColor })} />
            </Row>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Row label={`Window opacity (${Math.round(layer.bgOpacity * 100)}%)`}>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={layer.bgOpacity}
                onChange={(bgOpacity) => set({ bgOpacity })}
              />
            </Row>
            <Row label={`Corner radius (${layer.radius})`}>
              <Slider min={0} max={40} value={layer.radius} onChange={(radius) => set({ radius })} />
            </Row>
          </div>
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-cyan-500"
              checked={layer.titleBar}
              onChange={(e) => set({ titleBar: e.target.checked }, false)}
            />
            Show title bar
          </label>
          {layer.titleBar && (
            <Row label="Window title (optional)">
              <input
                className={inputCls}
                value={layer.title}
                placeholder="bash — 80×24"
                onChange={(e) => set({ title: e.target.value })}
              />
            </Row>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Row label={`Opacity (${Math.round(layer.opacity * 100)}%)`}>
          <Slider
            min={0.05}
            max={1}
            step={0.05}
            value={layer.opacity}
            onChange={(opacity) => set({ opacity })}
          />
        </Row>
        <Row label={`Rotation (${layer.rotation}°)`}>
          <Slider
            min={-180}
            max={180}
            value={layer.rotation}
            onChange={(rotation) => set({ rotation })}
          />
        </Row>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Row label="Position X">
          <input
            type="number"
            className={inputCls}
            value={layer.x}
            onChange={(e) => set({ x: +e.target.value || 0 })}
          />
        </Row>
        <Row label="Position Y">
          <input
            type="number"
            className={inputCls}
            value={layer.y}
            onChange={(e) => set({ y: +e.target.value || 0 })}
          />
        </Row>
      </div>

      {layer.type === 'text' && (
        <>
          <fieldset className="mb-3 rounded border border-slate-800 p-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={layer.shadow.enabled}
                onChange={(e) => setShadow({ enabled: e.target.checked })}
              />
              Text shadow
            </label>
            {layer.shadow.enabled && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                <label className="block text-[10px] text-slate-400">
                  Color
                  <input
                    type="color"
                    className="mt-1 h-7 w-full cursor-pointer rounded border border-slate-700 bg-slate-800"
                    value={layer.shadow.color}
                    onChange={(e) => setShadow({ color: e.target.value })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Blur
                  <input
                    type="number"
                    min="0"
                    max="60"
                    className={`${inputCls} mt-1 px-1`}
                    value={layer.shadow.blur}
                    onChange={(e) => setShadow({ blur: +e.target.value || 0 })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  X
                  <input
                    type="number"
                    className={`${inputCls} mt-1 px-1`}
                    value={layer.shadow.dx}
                    onChange={(e) => setShadow({ dx: +e.target.value || 0 })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Y
                  <input
                    type="number"
                    className={`${inputCls} mt-1 px-1`}
                    value={layer.shadow.dy}
                    onChange={(e) => setShadow({ dy: +e.target.value || 0 })}
                  />
                </label>
              </div>
            )}
          </fieldset>

          <fieldset className="mb-3 rounded border border-slate-800 p-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-cyan-500"
                checked={layer.box.enabled}
                onChange={(e) => setBox({ enabled: e.target.checked })}
              />
              Highlight box
            </label>
            <p className="mt-1 text-[10px] text-slate-500">
              Adds a panel behind the text so it stays readable on busy backgrounds.
            </p>
            {layer.box.enabled && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="block text-[10px] text-slate-400">
                  Color
                  <input
                    type="color"
                    className="mt-1 h-7 w-full cursor-pointer rounded border border-slate-700 bg-slate-800"
                    value={layer.box.color}
                    onChange={(e) => setBox({ color: e.target.value })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Opacity ({Math.round(layer.box.opacity * 100)}%)
                  <Slider
                    min={0.05}
                    max={1}
                    step={0.05}
                    value={layer.box.opacity}
                    onChange={(opacity) => setBox({ opacity })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Padding X
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className={`${inputCls} mt-1 px-1`}
                    value={layer.box.padX}
                    onChange={(e) => setBox({ padX: +e.target.value || 0 })}
                  />
                </label>
                <label className="block text-[10px] text-slate-400">
                  Padding Y
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className={`${inputCls} mt-1 px-1`}
                    value={layer.box.padY}
                    onChange={(e) => setBox({ padY: +e.target.value || 0 })}
                  />
                </label>
              </div>
            )}
          </fieldset>
        </>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button className={actionBtn} onClick={() => dispatch(moveLayer({ id: layer.id, dir: 'forward' }))}>
          Bring forward
        </button>
        <button className={actionBtn} onClick={() => dispatch(moveLayer({ id: layer.id, dir: 'backward' }))}>
          Send backward
        </button>
        <button className={actionBtn} onClick={() => dispatch(duplicateLayer(layer.id))}>
          Duplicate
        </button>
        <button
          className="rounded border border-red-900 bg-red-950 px-2 py-1.5 text-red-300 hover:bg-red-900"
          onClick={() => dispatch(removeLayer(layer.id))}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
