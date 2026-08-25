import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLayer, updateLayer, removeLayer } from '../features/editor/editorSlice';
import TextLayer from './TextLayer';
import ImageLayer from './ImageLayer';
import IconLayer from './IconLayer';
import TerminalLayer from './TerminalLayer';

const SNAP = 8; // real px of tolerance before a layer snaps to the center

const zoomBtn = (active) =>
  `rounded px-2 py-0.5 text-xs ${
    active ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }`;

export default function CanvasEditor() {
  const dispatch = useDispatch();
  const { canvas, background, layers, selectedId, showGrid, showSafeArea } = useSelector(
    (s) => s.editor
  );
  const wrapRef = useRef(null);
  const [zoom, setZoom] = useState('fit'); // 'fit' | number
  const [fitScale, setFitScale] = useState(0.5);
  const [guides, setGuides] = useState({ v: false, h: false });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () =>
      setFitScale(
        Math.max(
          0.1,
          Math.min(1, (el.clientWidth - 48) / canvas.width, (el.clientHeight - 48) / canvas.height)
        )
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvas.width, canvas.height]);

  // Arrow keys nudge the selected layer; Delete removes it. Typing in a form
  // field must keep working, so those targets are ignored.
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedId) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable)
        return;
      const layer = layers.find((l) => l.id === selectedId);
      if (!layer) return;
      const step = e.shiftKey ? 10 : 1;
      const moves = {
        ArrowLeft: { x: layer.x - step },
        ArrowRight: { x: layer.x + step },
        ArrowUp: { y: layer.y - step },
        ArrowDown: { y: layer.y + step },
      };
      if (moves[e.key]) {
        e.preventDefault();
        dispatch(updateLayer({ id: selectedId, patch: moves[e.key], coalesce: true }));
      } else if (e.key === 'Delete') {
        e.preventDefault();
        dispatch(removeLayer(selectedId));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedId, layers]);

  const scale = zoom === 'fit' ? fitScale : zoom;

  // Generic drag for any layer: pointer deltas are converted back to real
  // banner coordinates by dividing by the display scale.
  const startDrag = (e, layer, el) => {
    e.preventDefault();
    dispatch(selectLayer(layer.id));
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = layer.x;
    const origY = layer.y;
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const move = (ev) => {
      let x = origX + (ev.clientX - startX) / scale;
      let y = origY + (ev.clientY - startY) / scale;
      let v = false;
      let hz = false;
      if (Math.abs(x + w / 2 - canvas.width / 2) < SNAP) {
        x = canvas.width / 2 - w / 2;
        v = true;
      }
      if (Math.abs(y + h / 2 - canvas.height / 2) < SNAP) {
        y = canvas.height / 2 - h / 2;
        hz = true;
      }
      setGuides({ v, h: hz });
      dispatch(
        updateLayer({ id: layer.id, patch: { x: Math.round(x), y: Math.round(y) }, coalesce: true })
      );
    };
    const up = () => {
      setGuides({ v: false, h: false });
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const renderLayer = (l) => {
    const props = { layer: l, selected: l.id === selectedId, onStartDrag: startDrag };
    if (l.type === 'text') return <TextLayer key={l.id} {...props} />;
    if (l.type === 'icon') return <IconLayer key={l.id} {...props} />;
    if (l.type === 'terminal') return <TerminalLayer key={l.id} {...props} />;
    return <ImageLayer key={l.id} {...props} />;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-slate-800 px-4 py-1.5 text-sm">
        <span className="mr-2 text-xs text-slate-500">Zoom</span>
        <button className={zoomBtn(zoom === 'fit')} onClick={() => setZoom('fit')}>
          Fit
        </button>
        {[0.5, 0.75, 1].map((z) => (
          <button key={z} className={zoomBtn(zoom === z)} onClick={() => setZoom(z)}>
            {z * 100}%
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-xs text-slate-500">
          {canvas.width} × {canvas.height} px · showing {Math.round(scale * 100)}%
        </span>
      </div>

      <div ref={wrapRef} className="flex flex-1 overflow-auto bg-slate-950 p-6">
        <div
          className="m-auto"
          style={{ width: canvas.width * scale, height: canvas.height * scale }}
        >
          <div
            className="relative overflow-hidden shadow-2xl ring-1 ring-slate-700"
            style={{
              width: canvas.width,
              height: canvas.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundColor: background?.source === 'color' ? background.color : canvas.fill,
            }}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) dispatch(selectLayer(null));
            }}
          >
            {background?.url && (
              <img
                src={background.url}
                alt=""
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            )}

            {showGrid && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />
            )}

            {layers.map(renderLayer)}

            {showSafeArea && (
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute border border-dashed border-amber-400/60"
                  style={{
                    left: canvas.width * 0.06,
                    right: canvas.width * 0.06,
                    top: canvas.height * 0.12,
                    bottom: canvas.height * 0.12,
                  }}
                />
                {/* LinkedIn overlays the profile photo here on desktop. */}
                <div
                  className="absolute rounded-full border-2 border-dashed border-amber-400/70"
                  style={{
                    left: canvas.width * 0.03,
                    bottom: -canvas.height * 0.18,
                    width: canvas.height * 0.52,
                    height: canvas.height * 0.52,
                  }}
                />
                <span
                  className="absolute rounded bg-amber-400/90 px-2 py-0.5 text-[11px] font-semibold text-amber-950"
                  style={{ left: canvas.width * 0.06 + 8, top: canvas.height * 0.12 + 8 }}
                >
                  Keep important text inside this area
                </span>
              </div>
            )}

            {guides.v && (
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-cyan-400" />
            )}
            {guides.h && (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-cyan-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
