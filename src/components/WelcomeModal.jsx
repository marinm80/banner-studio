// First-run dialog, shown only when there is no saved work (App reads
// `hadSavedWork` from the store). Starting from a template is far easier than
// starting from an empty canvas, so that is what it offers.

import TemplateGallery from './TemplateGallery';

export default function WelcomeModal({ onClose, onHelp }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="modal-cap w-full max-w-3xl overflow-y-auto overscroll-contain rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Welcome — let&apos;s make your LinkedIn banner</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
          Start with one of these and change whatever you want: the name, the colors, the icons, the
          background. If you have never designed anything before, that is completely fine — pick the
          one that matches what you study and edit the text.
        </p>

        <div className="mt-5">
          <TemplateGallery compact onApplied={onClose} />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button className="text-xs text-cyan-400 hover:text-cyan-300" onClick={onHelp}>
            Show me how it works first
          </button>
          <button
            className="rounded border border-slate-700 px-4 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            onClick={onClose}
          >
            Skip — start from scratch
          </button>
        </div>
      </div>
    </div>
  );
}
