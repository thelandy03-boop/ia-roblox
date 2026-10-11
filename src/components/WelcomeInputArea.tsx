"use client";

import { useState, useRef, useEffect, KeyboardEvent, FormEvent } from "react";

export interface ModelOption {
  value: string;
  label: string;
}

export const DEFAULT_MODELS: ModelOption[] = [
  { value: "Z GLM 5.3 Flash", label: "Z GLM 5.3 Flash" },
  { value: "Z GLM 4.5 Pro", label: "Z GLM 4.5 Pro" },
  { value: "Roblox Specialist", label: "Roblox Specialist" },
];

interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
  models?: ModelOption[];
}

function ModelSelector({ selectedModel, onChange, models = DEFAULT_MODELS }: ModelSelectorProps) {
  return (
    <div className="relative flex min-w-0 items-center">
      <div
        className="inline-flex h-10 w-fit min-w-0 max-w-full shrink items-center gap-2 overflow-hidden rounded-xl bg-transparent py-0 ps-3 pe-3.5 text-sm text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white pointer-events-none"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="size-3.5 shrink-0">
            <path d="M4.5 4h15v3.4L10.6 16.6h8.9V20h-15v-3.4l8.9-9.2H4.5V4z" />
          </svg>
          <span className="min-w-0 truncate font-normal tracking-tight">{selectedModel}</span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3 shrink-0 opacity-50 transition-transform duration-200"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <select
        aria-label="Select AI Model"
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-white/20 rounded-xl"
      >
        {models.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CreditsBadgeProps {
  credits?: string;
}

function CreditsBadge({ credits = "0.21" }: CreditsBadgeProps) {
  return (
    <div
      className="flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white"
      aria-label={`Credits: ${credits}`}
      title="Credits"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <span className="whitespace-nowrap font-normal tracking-tight">{credits}</span>
    </div>
  );
}

interface GenerateButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

function GenerateButton({ disabled = false, onClick }: GenerateButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label="Generate"
      onClick={onClick}
      className={`
        group relative inline-flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-semibold
        transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ef4c]/50
        active:scale-[0.95] disabled:pointer-events-none
        ${
          disabled
            ? "bg-white/10 text-white/40 shadow-none scale-100"
            : "bg-[#d6ef4c] text-neutral-900 shadow-[0_0_22px_rgba(214,239,76,0.5)] hover:bg-[#e3fc6a] hover:shadow-[0_0_30px_rgba(214,239,76,0.75)] scale-[1.02] animate-in fade-in zoom-in-95 duration-200"
        }
      `}
    >
      {/* Destello de luz animado (Shimmer effect) cuando el botón se activa */}
      {!disabled && (
        <span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
          style={{ animation: "shimmer 2.5s infinite" }}
        />
      )}

      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`relative z-10 transition-transform duration-300 ${!disabled ? "group-hover:rotate-12 group-hover:scale-110" : ""}`}
        aria-hidden="true"
      >
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
      <span className="relative z-10">Generate</span>
    </button>
  );
}

interface WelcomeInputAreaProps {
  onGenerate: (prompt: string) => void;
  className?: string;
  style?: React.CSSProperties;
  models?: ModelOption[];
  initialModel?: string;
  placeholder?: string;
  credits?: string;
}

export function WelcomeInputArea({
  onGenerate,
  className,
  style,
  models = DEFAULT_MODELS,
  initialModel = "Z GLM 5.3 Flash",
  placeholder = "Add double-jump with particles",
  credits = "0.21",
}: WelcomeInputAreaProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const canSubmit = prompt.trim().length > 0;

  const submit = () => {
    const value = prompt.trim();
    if (!value) return;
    onGenerate(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`relative mx-auto w-full max-w-3xl ${className ?? ""}`} style={style}>
      {/* 1. Aura Ambiental Flotante Tras la Caja */}
      <div
        className={`pointer-events-none absolute -inset-1.5 rounded-[2.2rem] bg-gradient-to-r from-[#d6ef4c]/20 via-[#38bdf8]/20 to-[#d6ef4c]/20 blur-xl transition-all duration-500 ${
          isFocused || canSubmit ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        data-slot="prompt-composer-surface"
        className={`relative isolate mx-auto h-32 min-h-32 w-full overflow-hidden rounded-[2rem] bg-neutral-800/94 text-white backdrop-blur-xl transition-all duration-300 ease-out ${
          isFocused
            ? "shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_0_0_6px_rgba(255,255,255,0.08),0_12px_36px_-12px_rgba(0,0,0,0.7),0_32px_75px_-28px_rgba(0,0,0,0.95)] scale-[1.005]"
            : "shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_0_6px_rgba(255,255,255,0.055),0_10px_28px_-14px_rgba(0,0,0,0.62),0_32px_70px_-30px_rgba(0,0,0,0.9)]"
        }`}
      >
        {/* 2. Haz de Luz Superior (Top Border Beam) */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-40"
          }`}
        />

        {/* Placeholder visual (exactamente alineado con el input) */}
        {!prompt && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[76px] items-center px-7">
            <p className="w-full truncate text-left text-base leading-6 font-normal text-white/40 transition-opacity duration-200">
              {placeholder}
            </p>
          </div>
        )}

        {/* Input real */}
        <input
          ref={inputRef}
          id="dashboard-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          data-gramm="false"
          aria-label="Prompt"
          className="absolute inset-x-0 top-0 z-50 h-[76px] w-full rounded-t-[2rem] border-none bg-transparent px-7 text-base leading-6 text-white caret-[#d6ef4c] placeholder:text-transparent focus:outline-none focus:ring-0 selection:bg-[#d6ef4c]/30"
        />

        {/* Toolbar inferior */}
        <div className="absolute inset-x-4 bottom-4 z-50 flex h-10 items-center justify-end gap-2">
          <div className="flex h-10 min-w-0 items-center gap-0.5 overflow-hidden rounded-xl bg-white/[0.07] ring-1 ring-inset ring-white/[0.07] backdrop-blur-md transition-colors hover:bg-white/[0.09]">
            <ModelSelector selectedModel={selectedModel} onChange={setSelectedModel} models={models} />
            <CreditsBadge credits={credits} />
          </div>

          <GenerateButton disabled={!canSubmit} />
        </div>
      </form>
    </div>
  );
}