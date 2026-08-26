import TemplateGallery from './TemplateGallery';
import BackgroundPicker from './BackgroundPicker';
import IconPicker from './IconPicker';

export const LIBRARY_TABS = [
  ['templates', 'Templates'],
  ['backgrounds', 'Backgrounds'],
  ['icons', 'Icons'],
];

export function LibraryTabs({ tab, onChange }) {
  return (
    <nav className="flex shrink-0 border-b border-slate-800">
      {LIBRARY_TABS.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 px-2 py-2.5 text-xs font-medium ${
            tab === id
              ? 'border-b-2 border-cyan-500 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function LibraryPanel({ tab }) {
  if (tab === 'backgrounds') return <BackgroundPicker />;
  if (tab === 'icons') return <IconPicker />;
  return <TemplateGallery />;
}
