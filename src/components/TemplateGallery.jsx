import { useDispatch } from 'react-redux';
import { applyTemplate } from '../features/editor/editorSlice';
import { TEMPLATES, TEMPLATE_GROUPS, buildTemplate, templatePreview } from '../data/templates';

export default function TemplateGallery({ onApplied, compact = false }) {
  const dispatch = useDispatch();

  const apply = (t) => {
    dispatch(applyTemplate(buildTemplate(t)));
    onApplied?.(t);
  };

  return (
    <div className={compact ? '' : 'p-4'}>
      {!compact && (
        <>
          <h2 className="text-sm font-semibold">Start from a template</h2>
          <p className="mb-3 mt-1 text-[11px] leading-relaxed text-slate-400">
            Pick one, then change the name and anything else. Nothing here is locked.
          </p>
        </>
      )}

      {TEMPLATE_GROUPS.map((group) => (
        <section key={group} className="mb-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-400">
            {group}
          </h3>
          <div className={compact
                ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'
                : 'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1'}>
            {TEMPLATES.filter((t) => t.group === group).map((t) => (
              <button
                key={t.id}
                onClick={() => apply(t)}
                className="group block w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-left transition hover:border-cyan-500"
              >
                <img
                  src={templatePreview(t)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/1] w-full object-cover"
                />
                <div className="p-2">
                  <p className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
