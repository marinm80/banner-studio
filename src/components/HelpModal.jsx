// How-to dialog: the five steps to a finished banner, plus the things people
// otherwise never find — undo, the highlight box, arrow-key nudging.

import ContactCard from './ContactCard';

const STEPS = [
  [
    'Pick a template',
    'The Templates tab has one for each IT discipline plus general-purpose ones. Click it and the banner is already half done. The network ones arrive with a filled-in topology.',
  ],
  [
    'Put your name in',
    'Click the text on the banner, then edit it in the panel on the right. Change the font, size and color there too. “Align all text” lines every text layer up on one edge in a single click.',
  ],
  [
    'Add or swap your icons',
    'Open the Icons tab and click what you use — python, docker, cisco, sql — to drop it on the banner. Select an icon already on the banner first and the next one you click replaces it in place, which is how you change a node on the network templates.',
  ],
  [
    'Say how to reach you',
    'The Contact & profile group has LinkedIn, email, phone, location and WhatsApp, so the banner can point somewhere instead of only looking good.',
  ],
  [
    'Check the safe area',
    'Turn on “Safe area” in the top bar. Keep your name inside the dashed box and away from the circle where LinkedIn puts your photo.',
  ],
  ['Download it', 'Hit Download, choose JPEG or PNG, and upload the file to LinkedIn.'],
];

const TIPS = [
  'Nothing is permanent — Undo and Redo are in the top bar, and “Start over” gives you a clean canvas. Aligning all the text is a single undo step, so it costs nothing to try.',
  'If text is hard to read over a busy background, turn on “Highlight box” or “Text shadow” for that layer.',
  'The icon library is grouped — Networking, Cloud, Databases, Contact and so on — and the search box matches names and keywords, in English or Spanish.',
  'Missing an icon? “Add your own icon” at the bottom of the Icons tab takes an SVG, PNG or JPG, and yours then behave like any other, swap included.',
  'Arrow keys nudge the selected layer one pixel; hold Shift to move ten at a time. Delete removes it.',
  'Your work saves itself in this browser. Nothing is uploaded anywhere and there is no account to create.',
  'No idea what to write? “Information Technology Student · Open to opportunities” is a perfectly good headline.',
];

export default function HelpModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Help"
    >
      <div
        className="modal-cap w-full max-w-2xl overflow-y-auto overscroll-contain rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">How to use Banner Studio</h2>
            <p className="mt-1 text-xs text-slate-400">
              Six steps. No design experience needed.
            </p>
          </div>
          <button className="text-slate-400 hover:text-white" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <ol className="mb-5 space-y-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-100">{title}</p>
                <p className="text-xs leading-relaxed text-slate-400">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mb-2 text-sm font-semibold">Good to know</h3>
        <ul className="mb-5 space-y-1.5">
          {TIPS.map((t) => (
            <li key={t} className="flex gap-2 text-xs leading-relaxed text-slate-400">
              <span className="text-cyan-400">•</span>
              {t}
            </li>
          ))}
        </ul>

        <ContactCard />

        <div className="mt-5 flex justify-end">
          <button
            className="rounded bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
