import { useState } from 'react';

export const CONTACT_EMAIL = 'euclidesm195@gmail.com';

export default function ContactCard({ compact = false }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 text-[11px] text-slate-500">
        Feedback or ideas?
        <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">{CONTACT_EMAIL}</code>
        <button onClick={copy} className="text-cyan-400 hover:text-cyan-300">
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <h3 className="text-sm font-semibold text-slate-100">Questions, ideas or bugs?</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        This tool was built to help ATC students put together a decent LinkedIn banner without
        needing design software. If something is broken, confusing, or you want another icon or
        template added, write to:
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="rounded bg-slate-900 px-3 py-1.5 text-sm text-cyan-300">
          {CONTACT_EMAIL}
        </code>
        <button
          onClick={copy}
          className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
        >
          {copied ? 'Copied ✓' : 'Copy address'}
        </button>
      </div>
    </div>
  );
}
