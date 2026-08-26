import { useRef } from 'react';
import { iconSrc } from '../utils/canvasUtils';

export default function IconLayer({ layer, selected, onStartDrag }) {
  const ref = useRef(null);
  const s = layer.size;

  return (
    <div
      ref={ref}
      onPointerDown={(e) => onStartDrag(e, layer, ref.current)}
      className={`absolute cursor-move touch-none select-none ${
        selected
          ? 'outline-dashed outline-1 outline-cyan-400/80'
          : 'hover:outline-dashed hover:outline-1 hover:outline-slate-400/50'
      }`}
      style={{
        left: layer.x,
        top: layer.y,
        width: s,
        height: s,
        opacity: layer.opacity,
        transform: `rotate(${layer.rotation}deg)`,
      }}
    >
      {layer.badge !== 'none' && (
        <div
          className="absolute"
          style={
            layer.badge === 'circle'
              ? {
                  left: s / 2 - s * 0.78,
                  top: s / 2 - s * 0.78,
                  width: s * 1.56,
                  height: s * 1.56,
                  borderRadius: '50%',
                  background: layer.badgeColor,
                  opacity: layer.badgeOpacity,
                }
              : {
                  left: -s * 0.22,
                  top: -s * 0.22,
                  width: s * 1.44,
                  height: s * 1.44,
                  borderRadius: s * 0.3,
                  background: layer.badgeColor,
                  opacity: layer.badgeOpacity,
                }
          }
        />
      )}
      <img
        src={iconSrc(layer)}
        alt={layer.name}
        draggable={false}
        className="relative h-full w-full object-contain"
      />
    </div>
  );
}
