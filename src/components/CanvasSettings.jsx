// Banner dimensions and the base color painted behind everything else. The
// presets in the top bar cover the usual sizes; this is for anything else.

import { useDispatch, useSelector } from 'react-redux';
import { setCanvasSize, setCanvasFill } from '../features/editor/editorSlice';

const inputCls =
  'w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none';

export default function CanvasSettings() {
  const dispatch = useDispatch();
  const canvas = useSelector((s) => s.editor.canvas);

  return (
    <div className="border-b border-slate-800 p-4">
      <h2 className="mb-2 text-sm font-semibold">Banner size</h2>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-[11px] text-slate-400">
          Width
          <input
            type="number"
            min="200"
            max="4000"
            className={`${inputCls} mt-1`}
            value={canvas.width}
            onChange={(e) =>
              dispatch(setCanvasSize({ width: +e.target.value || canvas.width, height: canvas.height }))
            }
          />
        </label>
        <label className="text-[11px] text-slate-400">
          Height
          <input
            type="number"
            min="100"
            max="4000"
            className={`${inputCls} mt-1`}
            value={canvas.height}
            onChange={(e) =>
              dispatch(setCanvasSize({ width: canvas.width, height: +e.target.value || canvas.height }))
            }
          />
        </label>
        <label className="text-[11px] text-slate-400">
          Base color
          <input
            type="color"
            className="mt-1 h-[30px] w-full cursor-pointer rounded border border-slate-700 bg-slate-800"
            value={canvas.fill}
            onChange={(e) => dispatch(setCanvasFill(e.target.value))}
          />
        </label>
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        1584 × 396 is the size LinkedIn uses for a profile cover. The top bar has presets for the
        other common sizes.
      </p>
    </div>
  );
}
