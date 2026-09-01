// Contact details and portfolio link, in two forms: `compact` for the footer
// strip, and the full card for the side panel and the help dialog.

import { useState } from 'react';

export const CONTACT_EMAIL = 'euclidesm195@gmail.com';
export const PORTFOLIO_URL = 'https://rafaelmarin.dev';
// Shown instead of the full URL, which adds nothing at this size.
export const PORTFOLIO_LABEL = 'rafaelmarin.dev';

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
      <span className="inline-flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        Feedback or ideas?
        <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">{CONTACT_EMAIL}</code>
        <button onClick={copy} className="text-cyan-400 hover:text-cyan-300">
          {copied ? 'copied ✓' : 'copy'}
        </button>
        <span aria-hidden className="text-slate-700">
          ·
        </span>
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300"
        >
          {PORTFOLIO_LABEL}
        </a>
      </span>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <h3 className="text-sm font-semibold text-slate-100">Questions, ideas or bugs?</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        A free banner editor for anyone — no account, no design software. It started out helping
        ATC students, and the templates and icons still lean that way, but it works just as well
        for any profile. If something is broken, confusing, or you want another icon or template
        added, write to:
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
      <p className="mt-3 border-t border-slate-700 pt-3 text-xs text-slate-400">
        More of my projects:{' '}
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-cyan-400 hover:text-cyan-300"
        >
          {PORTFOLIO_LABEL} ↗
        </a>
      </p>
    </div>
  );
}
