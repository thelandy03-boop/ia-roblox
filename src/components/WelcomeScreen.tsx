"use client";

import { SuggestionChips } from "@/components/SuggestionChips";
import { WelcomeInputArea } from "@/components/WelcomeInputArea";

interface WelcomeScreenProps {
  onSuggestionClick: (content: string) => void;
  onGenerate: (prompt: string) => void;
  className?: string;
}

export function WelcomeScreen({ onSuggestionClick, onGenerate, className }: WelcomeScreenProps) {
  return (
    <div
      className={`${className ?? ""} relative z-10 flex h-full flex-col items-center justify-center px-6`}
    >
      {/* Hero Title */}
      <div className="welcome-enter mb-8 flex flex-col items-center justify-center">
        <h2 className="text-balance text-center font-narrow-black uppercase text-[clamp(3rem,5.5vw,5rem)] leading-[0.9] [word-spacing:0.08em] text-white">
          <span className="block">
            <span className="mb-2 block">Describe a</span>
            <span
              className="relative inline-grid overflow-hidden rounded-[0.3em] align-baseline"
              data-highlight-surface="workspace"
            >
              {/* Base layer (fallback / SEO) */}
              <span className="relative z-0 col-start-1 row-start-1 px-[0.12em] py-[0.12em] pt-[0.08em] text-brand-white">
                game mechanic
              </span>

              {/* Glass pill + gradient text */}
              <span
                aria-hidden="true"
                className="relative z-10 col-start-1 row-start-1 rounded-[0.3em] border border-brand-white/20 bg-brand-white/[0.07] px-[0.12em] py-[0.12em] pt-[0.08em]"
                style={{ transform: "none" }}
              >
                <span className="bg-linear-to-b from-brand-white from-15% to-brand-yellow bg-clip-text text-transparent">
                  game mechanic
                </span>
              </span>
            </span>
          </span>
        </h2>
      </div>

      {/* Suggestion Chips */}
      <div
        className="welcome-enter flex w-full max-w-4xl flex-none justify-center"
        style={{ animationDelay: "0.15s" }}
      >
        <SuggestionChips onClick={onSuggestionClick} />
      </div>

      {/* Input Area */}
      <div
        className="welcome-enter mt-5 w-full max-w-3xl flex-none"
        style={{ animationDelay: "0.25s" }}
      >
        <WelcomeInputArea onGenerate={onGenerate} />
      </div>
    </div>
  );
}