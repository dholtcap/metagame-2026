"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// DEV-ONLY, throwaway. A lab for picking the above-the-fold background: drop
// an image anywhere on the page (or use the file picker) and it fills the
// first viewport behind the dice. Three sliders sit right below the fold:
//   peak  — opacity of the cream wash at the circle's centre (mutes colours)
//   taper — how far out the wash fades to nothing (% of the circle radius)
//   zoom  — scale of the image
// Settings (and the image, if it fits) persist in localStorage. Delete this
// file once the image is chosen and the real backdrop is coded in.
const KEY = "hero-backdrop-lab";
const CREAM = "255, 245, 242";

type Settings = { peak: number; taper: number; zoom: number; src: string };
const DEFAULTS: Settings = { peak: 0.5, taper: 100, zoom: 1, src: "" };

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function HeroBackdropLab() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [centerY, setCenterY] = useState(30);
  const layerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // Deferred a frame: localStorage is client-only, and the hero needs layout.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setS(load());
      loaded.current = true;
      // Centre the wash on the hero (the dice), not the viewport.
      const hero = layerRef.current?.parentElement;
      const layer = layerRef.current;
      if (hero && layer) {
        setCenterY((hero.offsetHeight / 2 / layer.offsetHeight) * 100);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!loaded.current) return; // don't clobber the saved state with defaults
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      // Image too big for localStorage — it just won't survive a reload.
    }
  }, [s]);

  const set = (patch: Partial<Settings>) => setS((p) => ({ ...p, ...patch }));

  const readFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setS((p) => ({ ...p, src: String(reader.result) }));
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    const over = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault();
      readFile(e.dataTransfer?.files[0]);
    };
    window.addEventListener("dragover", over);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragover", over);
      window.removeEventListener("drop", drop);
    };
  }, [readFile]);

  const wash = `radial-gradient(circle at 50% ${centerY.toFixed(1)}%, rgba(${CREAM}, ${s.peak}) 0%, rgba(${CREAM}, 0) ${s.taper}%)`;

  return (
    <>
      {/* the backdrop: first viewport, behind the dice */}
      <div
        ref={layerRef}
        aria-hidden
        // w-screen centred on the section: the hero sits inside main's
        // gutter, so inset-x-0 would leave cream strips at the edges.
        className="absolute top-0 left-1/2 -z-10 h-dvh w-screen -translate-x-1/2 overflow-hidden"
      >
        {s.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.src}
            alt=""
            className="h-full w-full object-cover"
            style={{ transform: `scale(${s.zoom})` }}
          />
        ) : (
          <div className="flex h-full items-end justify-center pb-24 font-space-mono text-sm text-ink/40">
            drop an image anywhere to try it as the backdrop
          </div>
        )}
        <div className="absolute inset-0" style={{ background: wash }} />
      </div>

      {/* controls: pinned just below the fold */}
      <div className="absolute top-[100dvh] left-1/2 z-20 mt-6 w-fit -translate-x-1/2 rounded-lg border border-line bg-white/90 px-5 py-4 text-left font-space-mono text-xs text-ink shadow-lg backdrop-blur">
        <Slider
          label="peak"
          value={s.peak}
          min={0}
          max={1}
          step={0.01}
          onChange={(peak) => set({ peak })}
        />
        <Slider
          label="taper"
          value={s.taper}
          min={10}
          max={200}
          step={1}
          onChange={(taper) => set({ taper })}
        />
        <Slider
          label="zoom"
          value={s.zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(zoom) => set({ zoom })}
        />
        <div className="mt-3 flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => readFile(e.target.files?.[0])}
          />
          <button
            type="button"
            className="rounded border border-line px-2 py-1 hover:bg-ink/5"
            onClick={() => setS({ ...DEFAULTS })}
          >
            reset
          </button>
        </div>
      </div>
    </>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 py-1">
      <span className="w-12">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-64"
      />
      <span className="w-12 text-right tabular-nums">{value}</span>
    </label>
  );
}
