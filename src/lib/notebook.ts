"use client";

import { useSyncExternalStore } from "react";

/** A reader's saved items and notes, kept in this browser only. */
export interface NoteItem {
  kind: string;
  id: string;
  note: string;
}
export interface NotebookState {
  items: NoteItem[];
  scratch: string;
}

const KEY = "evo-viz-notebook-v1";
const EMPTY: NotebookState = { items: [], scratch: "" };
let state: NotebookState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NotebookState>;
      state = {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        scratch: typeof parsed.scratch === "string" ? parsed.scratch : "",
      };
    }
  } catch {
    // Storage can be unavailable (private windows); the notebook then lasts for the visit.
  }
}

function set(next: NotebookState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // see above
  }
  listeners.forEach((l) => l());
}

export const notebook = {
  has(kind: string, id: string) {
    return state.items.some((i) => i.kind === kind && i.id === id);
  },
  toggle(kind: string, id: string) {
    if (notebook.has(kind, id)) {
      set({ ...state, items: state.items.filter((i) => !(i.kind === kind && i.id === id)) });
    } else {
      set({ ...state, items: [...state.items, { kind, id, note: "" }] });
    }
  },
  setNote(kind: string, id: string, note: string) {
    set({
      ...state,
      items: state.items.map((i) => (i.kind === kind && i.id === id ? { ...i, note } : i)),
    });
  },
  setScratch(scratch: string) {
    set({ ...state, scratch });
  },
  clear() {
    set(EMPTY);
  },
};

export function useNotebook(): NotebookState {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      // Storage is read after hydration, so tell the subscriber about it.
      queueMicrotask(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => EMPTY,
  );
}
