import { useEffect, useState } from 'react';
import Toolbar from './components/Toolbar';
import CanvasEditor from './components/CanvasEditor';
import LibraryPanel, { LibraryTabs } from './components/LibraryPanel';
import DesignPanel from './components/DesignPanel';
import PanelSheet from './components/PanelSheet';
import ExportModal from './components/ExportModal';
import HelpModal from './components/HelpModal';
import WelcomeModal from './components/WelcomeModal';
import ContactCard from './components/ContactCard';
import useMediaQuery, { DOCKED_PANELS } from './hooks/useMediaQuery';
import { injectGoogleFonts } from './utils/fonts';
import { hadSavedWork } from './store';

// The four things the bottom bar can open on a narrow screen. The first three
// are the library tabs; "Design" is the whole right-hand column.
const SHEETS = [
  ['templates', 'Templates', '▦'],
  ['backgrounds', 'Backgrounds', '◧'],
  ['icons', 'Icons', '★'],
  // U+FE0E keeps the gear a glyph instead of a colour emoji on Apple platforms.
  ['design', 'Design', '\u2699\uFE0E'],
];

export default function App() {
  const [tab, setTab] = useState('templates');
  const [sheet, setSheet] = useState(null); // narrow screens only
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(!hadSavedWork);
  const docked = useMediaQuery(DOCKED_PANELS);

  useEffect(() => {
    injectGoogleFonts();
  }, []);

  // Coming back to a wide window with a drawer open would leave it stranded
  // on top of the docked panels.
  useEffect(() => {
    if (docked) setSheet(null);
  }, [docked]);

  const openLibrary = (id) => {
    setTab(id);
    if (!docked) setSheet(id);
  };

  return (
    <div className="app-shell flex flex-col bg-slate-950 text-slate-100">
      <Toolbar
        onExport={() => setExportOpen(true)}
        onHelp={() => setHelpOpen(true)}
        onOpenIcons={() => openLibrary('icons')}
      />

      <div className="flex min-h-0 flex-1">
        {docked && (
          <aside className="flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 2xl:w-80">
            <LibraryTabs tab={tab} onChange={setTab} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <LibraryPanel tab={tab} />
            </div>
          </aside>
        )}

        <main className="min-h-0 min-w-0 flex-1">
          <CanvasEditor />
        </main>

        {docked && (
          <aside className="w-72 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-900/60 2xl:w-80">
            <DesignPanel />
          </aside>
        )}
      </div>

      {!docked && sheet === 'design' && (
        <PanelSheet title="Design" onClose={() => setSheet(null)}>
          <DesignPanel />
          <p className="px-4 pb-4 text-[11px] leading-relaxed text-slate-500">
            Your work saves automatically in this browser — nothing is uploaded anywhere.
          </p>
        </PanelSheet>
      )}
      {!docked && sheet && sheet !== 'design' && (
        <PanelSheet
          title="Library"
          onClose={() => setSheet(null)}
          footer={
            <LibraryTabs
              tab={tab}
              onChange={(id) => {
                setTab(id);
                setSheet(id);
              }}
            />
          }
        >
          <LibraryPanel tab={tab} />
        </PanelSheet>
      )}

      {docked ? (
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-4 py-1.5 text-[11px] text-slate-500">
          <span>Your work saves automatically in this browser — nothing is uploaded anywhere.</span>
          <ContactCard compact />
        </footer>
      ) : (
        <nav className="safe-bottom flex shrink-0 border-t border-slate-800 bg-slate-900">
          {SHEETS.map(([id, label, glyph]) => (
            <button
              key={id}
              onClick={() => {
                if (id !== 'design') setTab(id);
                setSheet((s) => (s === id ? null : id));
              }}
              aria-pressed={sheet === id}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                sheet === id ? 'text-cyan-300' : 'text-slate-400'
              }`}
            >
              <span aria-hidden className="text-base leading-none">
                {glyph}
              </span>
              {label}
            </button>
          ))}
        </nav>
      )}

      {welcomeOpen && (
        <WelcomeModal
          onClose={() => setWelcomeOpen(false)}
          onHelp={() => {
            setWelcomeOpen(false);
            setHelpOpen(true);
          }}
        />
      )}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} />}
    </div>
  );
}
