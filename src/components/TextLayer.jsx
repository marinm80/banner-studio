import { useRef } from 'react';
import { LINE_HEIGHT } from '../utils/canvasUtils';

export default function TextLayer({ layer, selected, onStartDrag }) {
  const ref = useRef(null);
  const s = layer.shadow;
  const b = layer.box;

  return (
    <div
      ref={ref}
      onPointerDown={(e) => onStartDrag(e, layer, ref.current)}
      className={`absolute cursor-move select-none ${
        selected
          ? 'outline-dashed outline-1 outline-cyan-400/80'
          : 'hover:outline-dashed hover:outline-1 hover:outline-slate-400/50'
      }`}
      style={{
        left: layer.x,
        top: layer.y,
        fontFamily: `"${layer.font}"`,
        fontSize: layer.size,
        fontWeight: layer.weight,
        color: layer.color,
        textAlign: layer.align,
        lineHeight: LINE_HEIGHT,
        whiteSpace: 'pre',
        opacity: layer.opacity,
        transform: `rotate(${layer.rotation}deg)`,
        textShadow: s?.enabled ? `${s.dx}px ${s.dy}px ${s.blur}px ${s.color}` : 'none',
      }}
    >
      {b?.enabled && (
        // Absolutely positioned so the element's own box stays exactly the size
        // of the text — drag math and canvas export both depend on that.
        <div
          className="absolute"
          style={{
            left: -b.padX,
            top: -b.padY,
            right: -b.padX,
            bottom: -b.padY,
            background: b.color,
            opacity: b.opacity,
            borderRadius: b.radius,
          }}
        />
      )}
      <span className="relative">{layer.text || ' '}</span>
    </div>
  );
}
