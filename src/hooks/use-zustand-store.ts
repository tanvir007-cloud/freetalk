import { create } from "zustand";

interface OpenStore {
  open: boolean;
  setOpen: (value: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (value: boolean) => void;
}

export const useZustandStore = create<OpenStore>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
  loginOpen: false,
  setLoginOpen: (value) => set({ loginOpen: value }),
}));
