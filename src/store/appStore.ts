import { create } from 'zustand';

type AppState = {
  userName: string | null;
  setUserName: (name: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  userName: 'Administrateur',
  setUserName: (name) => set({ userName: name }),
}));
