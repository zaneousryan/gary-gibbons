// Gary's inner voice — barks render as a floating italic line, distinct from
// spoken dialogue (the design doc's *(inner)* register).

import { useEffect } from 'react';
import { useUiStore } from './uiStore';

export default function InnerVoice() {
  const line = useUiStore((s) => s.innerVoice);
  const show = useUiStore((s) => s.showInnerVoice);

  useEffect(() => {
    if (!line) return;
    const ms = Math.max(2800, line.text.length * 55);
    const t = setTimeout(() => show(null), ms);
    return () => clearTimeout(t);
  }, [line, show]);

  if (!line) return null;
  return (
    <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none" data-testid="inner-voice">
      <div className="max-w-[760px] bg-ink/80 text-cream/95 italic text-lg px-6 py-3 rounded-lg border border-dusk shadow-xl">
        {line.text}
      </div>
    </div>
  );
}
