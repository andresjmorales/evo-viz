"use client";

import { useSyncExternalStore } from "react";
import { TIME_MAX_KA, kaToX, xToKa } from "./timeScale";

/**
 * The shared clock. Kept outside React so the WebGL globe can read it every
 * frame without re-rendering the page.
 */
type Listener = () => void;

const state = { ka: TIME_MAX_KA, playing: false };
const listeners = new Set<Listener>();
let raf = 0;
let last = 0;

/** Seconds for a full run from 7 Ma to the present. */
const RUN_SECONDS = 75;

function emit() {
  listeners.forEach((l) => l());
}

function tick(now: number) {
  if (!state.playing) return;
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const t = kaToX(state.ka, 1) + dt / RUN_SECONDS;
  if (t >= 1) {
    state.ka = 0;
    state.playing = false;
  } else {
    state.ka = xToKa(t, 1);
    raf = requestAnimationFrame(tick);
  }
  emit();
}

export const timeStore = {
  get ka() {
    return state.ka;
  },
  get playing() {
    return state.playing;
  },
  setKa(ka: number) {
    const next = Math.min(TIME_MAX_KA, Math.max(0, ka));
    if (next === state.ka) return;
    state.ka = next;
    emit();
  },
  play() {
    if (state.playing) return;
    if (state.ka <= 0.01) state.ka = TIME_MAX_KA;
    state.playing = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
    emit();
  },
  pause() {
    if (!state.playing) return;
    state.playing = false;
    cancelAnimationFrame(raf);
    emit();
  },
  toggle() {
    if (state.playing) timeStore.pause();
    else timeStore.play();
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

/** Current time, rounded so React only re-renders when the label would change. */
export function useKa(): number {
  return useSyncExternalStore(
    timeStore.subscribe,
    () => quantize(state.ka),
    () => TIME_MAX_KA,
  );
}

export function usePlaying(): boolean {
  return useSyncExternalStore(
    timeStore.subscribe,
    () => state.playing,
    () => false,
  );
}

/** Derive a value from the clock; re-renders only when the result changes. */
export function useKaSelector<T>(select: (ka: number) => T, server: T): T {
  return useSyncExternalStore(
    timeStore.subscribe,
    () => select(state.ka),
    () => server,
  );
}

function quantize(ka: number): number {
  if (ka >= 1000) return Math.round(ka / 10) * 10;
  if (ka >= 100) return Math.round(ka);
  if (ka >= 10) return Math.round(ka * 2) / 2;
  return Math.round(ka * 10) / 10;
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __time: typeof timeStore }).__time = timeStore;
}
