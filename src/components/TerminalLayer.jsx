// The fake terminal window: frame, optional title bar with traffic lights, and
// the command lines. A line starting with "$" is drawn in the prompt color.
// Geometry comes from terminalMetrics so the editor and the export agree.
// Mirrored by drawTerminalLayer in canvasUtils.

import { useRef } from 'react';
import { terminalMetrics } from '../utils/canvasUtils';

export default function TerminalLayer({ layer, selected, onStartDrag }) {
  const ref = useRef(null);
  const m = terminalMetrics(layer);

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
        width: m.width,
        height: m.height,
        opacity: layer.opacity,
        transform: `rotate(${layer.rotation}deg)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: layer.bgColor,
          opacity: layer.bgOpacity,
          borderRadius: layer.radius,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${layer.borderColor}`,
          opacity: 0.5,
          borderRadius: layer.radius,
        }}
      />

      {layer.titleBar && (
        <>
          {['#f87171', '#fbbf24', '#34d399'].map((c, i) => (
            <div
              key={c}
              className="absolute rounded-full"
              style={{
                left: layer.padding + 1 + i * 24,
                top: 15,
                width: 14,
                height: 14,
                background: c,
              }}
            />
          ))}
          {layer.title && (
            <div
              className="absolute text-center"
              style={{
                left: 0,
                right: 0,
                top: 22 - layer.fontSize * 0.5,
                fontFamily: 'monospace',
                fontSize: Math.round(layer.fontSize * 0.85),
                lineHeight: 1,
                color: layer.borderColor,
                opacity: 0.7,
              }}
            >
              {layer.title}
            </div>
          )}
        </>
      )}

      {m.lines.map((line, i) => {
        const isPrompt = line.trimStart().startsWith('$');
        return (
          <div
            key={i}
            className="absolute whitespace-pre overflow-hidden"
            style={{
              left: layer.padding,
              right: 6,
              top: m.titleBarH + layer.padding + i * layer.lineGap,
              height: layer.lineGap,
              lineHeight: `${layer.lineGap}px`,
              fontFamily: 'monospace',
              fontSize: layer.fontSize,
              color: isPrompt ? layer.promptColor : layer.textColor,
              opacity: isPrompt ? 0.95 : 0.7,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}
