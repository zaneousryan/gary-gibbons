// UI overlay state — which paper is in Gary's hands (tech spec §3: the world
// is Pixi; the paper is React).

import { create } from 'zustand';

export interface UiStore {
  examine: { title: string; text: string } | null;
  toast: string | null;
  devMenuOpen: boolean;
  setExamine(v: UiStore['examine']): void;
  showToast(text: string): void;
  clearToast(): void;
  toggleDevMenu(): void;
}

export const useUiStore = create<UiStore>()((set) => ({
  examine: null,
  toast: null,
  devMenuOpen: false,
  setExamine: (examine) => set({ examine }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
  toggleDevMenu: () => set((s) => ({ devMenuOpen: !s.devMenuOpen })),
}));
