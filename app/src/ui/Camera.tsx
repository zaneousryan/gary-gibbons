// Photo mode viewfinder (II.12.3): frame a subject, take the shot. Prints dry
// on the apartment line overnight.

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { hasCamera, subjectsHere, takePhoto } from '@systems/photo';
import { useUiStore } from './uiStore';

export default function Camera({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.cameraOpen);
  const toggle = useUiStore((s) => s.toggleCamera);
  const showToast = useUiStore((s) => s.showToast);
  const photos = useGameStore((s) => s.state.photos);
  if (!open) return null;
  if (!hasCamera()) return null;

  const subjects = subjectsHere(db);
  const taken = new Set(photos.map((p) => p.id));

  return (
    <div className="absolute inset-0 bg-ink/80 z-40 flex items-center justify-center pointer-events-auto" data-testid="camera" onClick={toggle}>
      <div className="w-[min(700px,92vw)] border-8 border-ink rounded-lg bg-dusk/40 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-4 border-2 border-cream/30 rounded pointer-events-none" />
        <div className="text-cream/60 text-xs tracking-[0.3em] font-bold mb-3">WARREN'S BELLOWS CAMERA · VIEWFINDER</div>
        {subjects.length === 0 && <p className="text-cream/70 italic">Nothing here asks to be photographed. The lanterns are always willing, elsewhere.</p>}
        <div className="space-y-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              data-testid={`photo-${s.id}`}
              disabled={taken.has(s.id)}
              onClick={() => {
                if (takePhoto(db, s.id)) {
                  showToast('The shutter breathes. The print dries overnight.');
                }
              }}
              className={
                'block w-full text-left border-2 rounded p-2 text-sm ' +
                (taken.has(s.id)
                  ? 'border-cream/20 text-cream/30 cursor-not-allowed'
                  : 'border-cream/60 text-cream cursor-pointer hover:bg-amber/20 hover:border-amber')
              }
            >
              {taken.has(s.id) ? '✓ ' : '◉ '} {s.label}
            </button>
          ))}
        </div>
        <button onClick={toggle} data-testid="camera-close" className="mt-4 px-4 py-1 border-2 border-cream/50 rounded text-cream cursor-pointer hover:bg-ink/40">
          lower the camera
        </button>
      </div>
    </div>
  );
}
