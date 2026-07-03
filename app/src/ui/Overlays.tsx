// Small shared overlays: examine panel and toast.

import { useEffect } from 'react';
import { useUiStore } from './uiStore';

export function ExaminePanel() {
  const examine = useUiStore((s) => s.examine);
  const setExamine = useUiStore((s) => s.setExamine);
  if (!examine) return null;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-ink/40 pointer-events-auto"
      data-testid="examine-panel"
      onClick={() => setExamine(null)}
    >
      <div
        className="w-[min(640px,90vw)] bg-cream border-4 border-ink rounded-lg shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-ink font-bold text-2xl mb-2">{examine.title}</h2>
        <p className="text-ink text-lg leading-relaxed italic">{examine.text}</p>
        <button
          className="mt-4 px-4 py-1 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer"
          onClick={() => setExamine(null)}
          data-testid="examine-close"
        >
          done
        </button>
      </div>
    </div>
  );
}

export function Toast() {
  const toast = useUiStore((s) => s.toast);
  const clearToast = useUiStore((s) => s.clearToast);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2600);
    return () => clearTimeout(t);
  }, [toast, clearToast]);
  if (!toast) return null;
  return (
    <div className="absolute bottom-40 inset-x-0 flex justify-center pointer-events-none" data-testid="toast">
      <div className="bg-ink/90 text-cream px-5 py-2 rounded-full border border-amber/60 text-lg">{toast}</div>
    </div>
  );
}
