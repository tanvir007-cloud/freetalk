import { create } from "zustand";

interface OpenStore {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const useZustandStore = create<OpenStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
