"use client";

import React, { useState } from "react";

interface SwitchProfile {
  id: string;
  name: string;
  type: string;
  actuation: string;
  soundDescription: string;
  color: string;
  stemColor: string;
  frequency: number;
  clickiness: number;
}

const SWITCHES: SwitchProfile[] = [
  {
    id: "linear-red",
    name: "Linear HyperSpeed Red",
    type: "Linear Smooth",
    actuation: "1.2mm • 45g Force",
    soundDescription: "Crisp, muted acoustic bottom-out",
    color: "#EF4444",
    stemColor: "bg-red-500",
    frequency: 320,
    clickiness: 0.1,
  },
  {
    id: "tactile-panda",
    name: "CyberPanda Tactile 67g",
    type: "Tactile Heavy Bump",
    actuation: "2.0mm • 67g Force",
    soundDescription: "Deep rounded \"thock\" resonance",
    color: "#FF6B00",
    stemColor: "bg-orange-500",
    frequency: 240,
    clickiness: 0.4,
  },
  {
    id: "clicky-cyan",
    name: "Neon Clickleaf Blue",
    type: "Audible Click Bar",
    actuation: "1.8mm • 55g Force",
    soundDescription: "High-frequency metallic click snap",
    color: "#00F0FF",
    stemColor: "bg-cyan-400",
    frequency: 880,
    clickiness: 0.9,
  },
  {
    id: "magnetic-hall",
    name: "Hall-Effect Rapid Magnetic",
    type: "Analog Flux Sensor",
    actuation: "0.1mm - 4.0mm Adjustable",
    soundDescription: "Damped gasket-mounted deep thock",
    color: "#8B5CF6",
    stemColor: "bg-purple-500",
    frequency: 180,
    clickiness: 0.05,
  },
];

export default function KeyboardSoundboard() {
  const [activeSwitch, setActiveSwitch] = useState<string>("linear-red");
  const [depressedSwitch, setDepressedSwitch] = useState<string | null>(null);

  const playSwitchActuationSound = (sw: SwitchProfile) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;

      // 1. Primary Bottom-out Oscillator (Thock/Clack body)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sw.clickiness > 0.5 ? "square" : "triangle";
      osc.frequency.setValueAtTime(sw.frequency, now);
      osc.frequency.exponentialRampToValueAtTime(sw.frequency * 0.4, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);

      // 2. Clickleaf / Snap transient (for clicky or tactile switches)
      if (sw.clickiness > 0.2) {
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = "sine";
        clickOsc.frequency.setValueAtTime(sw.frequency * 2.8, now);
        clickOsc.frequency.exponentialRampToValueAtTime(sw.frequency * 0.8, now + 0.02);

        clickGain.gain.setValueAtTime(sw.clickiness * 0.4, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(now);
        clickOsc.stop(now + 0.03);
      }
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  };

  const handleActuate = (sw: SwitchProfile) => {
    setActiveSwitch(sw.id);
    setDepressedSwitch(sw.id);
    playSwitchActuationSound(sw);
    setTimeout(() => setDepressedSwitch(null), 120);
  };

  return (
    <div className="w-full bg-[#12121A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <h3 className="font-chakra text-lg font-bold uppercase tracking-wider text-white">
              Tactile Soundboard &amp; Switch Studio
            </h3>
          </div>
          <p className="font-sans text-xs text-slate-400 mt-0.5">
            Real-time acoustic feedback simulator. Click keys to audition custom lubed switch profiles.
          </p>
        </div>

        <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold uppercase">
          Synthesizer Live // WebAudio API
        </span>
      </div>

      {/* 4 Switch Soundboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SWITCHES.map((sw) => {
          const isSelected = activeSwitch === sw.id;
          const isPressed = depressedSwitch === sw.id;

          return (
            <div
              key={sw.id}
              onClick={() => handleActuate(sw)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-[#161622] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  : "bg-[#0A0A0F] border-slate-800 hover:border-slate-600 hover:bg-[#12121A]"
              } ${isPressed ? "scale-[0.97]" : ""}`}
            >
              <div>
                {/* Physical Mechanical Keycap Mockup */}
                <div className="flex justify-center mb-3">
                  <div
                    className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-transform ${
                      isPressed ? "translate-y-1.5 shadow-inner" : "shadow-lg"
                    }`}
                    style={{
                      borderColor: sw.color,
                      backgroundColor: "#0A0A0F",
                      boxShadow: isSelected
                        ? `0 0 16px ${sw.color}40`
                        : "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Cross Stem in Center */}
                    <div
                      className={`w-4 h-4 ${sw.stemColor} rounded-xs flex items-center justify-center`}
                    >
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 mt-1 uppercase font-bold">
                      ACTUATE
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-chakra text-sm font-bold text-white tracking-wide">
                    {sw.name}
                  </h4>
                  <span
                    className="inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                    style={{ backgroundColor: `${sw.color}20`, color: sw.color }}
                  >
                    {sw.type}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <p className="font-mono text-[10.5px] text-slate-300">
                  {sw.actuation}
                </p>
                <p className="font-sans text-[11px] text-slate-400 mt-1 italic">
                  &ldquo;{sw.soundDescription}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
