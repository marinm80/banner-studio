// A panel docked below the canvas on narrow screens. It pushes the canvas up
// rather than covering it, so the banner stays visible — and shrinks — while a
// panel is open. The height cap always leaves the canvas enough room to show a
// banner, even on a landscape phone.

import { useEffect } from 'react';

export default function PanelSheet({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <section
      aria-label={title}
      className="flex max-h-[min(60dvh,calc(100dvh-16rem))] shrink-0 flex-col border-t border-slate-700 bg-slate-900"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          className="grid h-8 w-8 place-items-center rounded text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      {footer}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </section>
  );
}
