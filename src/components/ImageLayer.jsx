// An uploaded picture as a layer. Only the width is ever set — the height
// follows the image's own aspect ratio, here and in the export alike.
// Mirrored by drawImageLayer in canvasUtils.

import { useRef } from 'react';

export default function ImageLayer({ layer, selected, onStartDrag }) {
  const ref = useRef(null);

  return (
    <img
      ref={ref}
      src={layer.src}
      alt={layer.name}
      draggable={false}
      onPointerDown={(e) => onStartDrag(e, layer, ref.current)}
      className={`absolute cursor-move touch-none select-none ${
        selected
          ? 'outline-dashed outline-1 outline-cyan-400/80'
          : 'hover:outline-dashed hover:outline-1 hover:outline-slate-400/50'
      }`}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        opacity: layer.opacity,
        borderRadius: layer.radius,
        transform: `rotate(${layer.rotation}deg)`,
      }}
    />
  );
}
