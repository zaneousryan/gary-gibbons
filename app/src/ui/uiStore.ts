// UI overlay state — which paper is in Gary's hands (tech spec §3: the world
// is Pixi; the paper is React).

import { create } from 'zustand';

export interface UiStore {
  examine: { title: string; text: string } | null;
  toast: string | null;
  /** Gary's inner voice / bark line currently on screen. */
  innerVoice: { text: string; speaker?: string } | null;
  devMenuOpen: boolean;
  notebookOpen: boolean;
  boardOpen: boolean;
  recapOpen: boolean;
  newspaperOpen: boolean;
  cameraOpen: boolean;
  grandpaHint: string | null;
  /** NPC greeting bubble shown when a conversation opens (III.23.3). */
  greeting: { name: string; text: string } | null;
  setExamine(v: UiStore['examine']): void;
  showToast(text: string): void;
  clearToast(): void;
  showInnerVoice(v: UiStore['innerVoice']): void;
  toggleDevMenu(): void;
  toggleNotebook(): void;
  toggleBoard(): void;
  toggleRecap(): void;
  toggleNewspaper(): void;
  toggleCamera(): void;
  showGrandpaHint(text: string | null): void;
  showGreeting(v: UiStore['greeting']): void;
}

export const useUiStore = create<UiStore>()((set) => ({
  examine: null,
  toast: null,
  innerVoice: null,
  devMenuOpen: false,
  notebookOpen: false,
  boardOpen: false,
  recapOpen: false,
  newspaperOpen: false,
  cameraOpen: false,
  grandpaHint: null,
  greeting: null,
  setExamine: (examine) => set({ examine }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  showInnerVoice: (innerVoice) => set({ innerVoice }),
  toggleDevMenu: () => set((s) => ({ devMenuOpen: !s.devMenuOpen })),
  toggleNotebook: () => set((s) => ({ notebookOpen: !s.notebookOpen })),
  toggleBoard: () => set((s) => ({ boardOpen: !s.boardOpen })),
  toggleRecap: () => set((s) => ({ recapOpen: !s.recapOpen })),
  toggleNewspaper: () => set((s) => ({ newspaperOpen: !s.newspaperOpen })),
  toggleCamera: () => set((s) => ({ cameraOpen: !s.cameraOpen })),
  showGrandpaHint: (grandpaHint) => set({ grandpaHint }),
  showGreeting: (greeting) => set({ greeting }),
}));
