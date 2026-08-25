import { useEffect, useState } from 'react';
import Toolbar from './components/Toolbar';
import BackgroundPicker from './components/BackgroundPicker';
import IconPicker from './components/IconPicker';
import TemplateGallery from './components/TemplateGallery';
import CanvasEditor from './components/CanvasEditor';
import CanvasSettings from './components/CanvasSettings';
import LayerList from './components/LayerList';
import PropertiesPanel from './components/PropertiesPanel';
import ExportModal from './components/ExportModal';
import HelpModal from './components/HelpModal';
import WelcomeModal from './components/WelcomeModal';
import ContactCard from './components/ContactCard';
import { injectGoogleFonts } from './utils/fonts';
import { hadSavedWork } from './store';

const TABS = [
  ['templates', 'Templates'],
  ['backgrounds', 'Backgrounds'],
  ['icons', 'Icons'],
];

export default function App() {
  const [tab, setTab] = useState('templates');
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(!hadSavedWork);

  useEffect(() => {
    injectGoogleFonts();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <Toolbar
        onExport={() => setExportOpen(true)}
        onHelp={() => setHelpOpen(true)}
        onOpenIcons={() => setTab('icons')}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-80 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60">
          <nav className="flex shrink-0 border-b border-slate-800">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 px-2 py-2 text-xs font-medium ${
                  tab === id
                    ? 'border-b-2 border-cyan-500 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === 'templates' && <TemplateGallery />}
            {tab === 'backgrounds' && <BackgroundPicker />}
            {tab === 'icons' && <IconPicker />}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <CanvasEditor />
        </main>

        <aside className="w-80 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-900/60">
          <CanvasSettings />
          <LayerList />
          <PropertiesPanel />
          <div className="p-4 pt-0">
            <ContactCard />
          </div>
        </aside>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-4 py-1.5 text-[11px] text-slate-500">
        <span>Your work saves automatically in this browser — nothing is uploaded anywhere.</span>
        <ContactCard compact />
      </footer>

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
