import { create } from "zustand";
import { persist } from "zustand/middleware";

export type I18n = Record<string, Record<string, string>>;
export type I18nState = {
  i18n: I18n;
  addLanguage: (language: string) => void;
  addTranslation: (language: string, key: string, value: string) => void;
  addKey: (key: string) => void;
  setI18n: (i18n: I18n) => void;
  reset: () => void;
};

const initialState = {
  english: {
    "hello-world": "Hello, World!",
    "goodbye-world": "Goodbye, World!",
  },
  italian: {},
  french: {},
  spanish: {},
};

export const useI18nState = create<I18nState>()(
  persist(
    (set) => ({
      i18n: initialState,
      addLanguage: (language: string) =>
        set((state) => ({
          i18n: { ...state.i18n, [language]: {} },
        })),
      addKey: (key: string) =>
        set((state) => ({
          i18n: {
            ...state.i18n,
            english: { ...state.i18n.english, [key]: "" },
          },
        })),
      addTranslation: (language: string, key: string, value: string) =>
        set((state) => ({
          i18n: {
            ...state.i18n,
            [language]: { ...state.i18n[language], [key]: value },
          },
        })),
      setI18n: (i18n: I18n) => set({ i18n }),
      reset: () => set({ i18n: { ...initialState } }),
    }),
    {
      name: "fast-json-i18n",
    }
  )
);
