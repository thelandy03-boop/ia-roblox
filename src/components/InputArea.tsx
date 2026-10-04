"use client";

import { useRef, useEffect, useCallback, useState, KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface InputAreaProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputArea({ onSend, disabled = false, placeholder = "Message..." }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState(48);
  const [hasContent, setHasContent] = useState(false);
  const prevContentRef = useRef("");

  const adjustHeight = useCallback(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 200);
    setHeight(newHeight);
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (hasContent && !prevContentRef.current) {
        gsap.from(textareaRef.current, {
          borderColor: "var(--primary)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (!hasContent && prevContentRef.current) {
        gsap.to(textareaRef.current, {
          borderColor: "var(--border)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
      prevContentRef.current = hasContent ? "true" : "";
    }, textareaRef);
    return () => ctx.revert();
  }, [hasContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setHasContent(value.trim().length > 0);
    adjustHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = e.currentTarget.value.trim();
      if (content && !disabled) {
        onSend(content);
        e.currentTarget.value = "";
        setHasContent(false);
        setHeight(48);
        adjustHeight();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.length > 10000) {
      e.preventDefault();
      const truncated = pastedText.slice(0, 10000);
      document.execCommand("insertText", false, truncated);
    }
  };

  return (
    <div className="relative border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3.5 text-base
              placeholder:text-muted-foreground focus-visible-ring
              transition-colors duration-200 resize-none
              disabled:opacity-50 disabled:cursor-not-allowed
              scrollbar-thin"
            style={{ height: `${height}px`, minHeight: "48px", maxHeight: "200px" }}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
          />
          {hasContent && (
            <div className="absolute bottom-3 right-3 pointer-events-none animate-pulse-subtle">
              <span className="text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                Enter to send
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Shift</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd>
            <span>for new line</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const content = textareaRef.current?.value.trim();
              if (content && !disabled) {
                onSend(content);
                if (textareaRef.current) {
                  textareaRef.current.value = "";
                  setHasContent(false);
                  setHeight(48);
                }
              }
            }}
            disabled={disabled || !hasContent}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-background
              hover:bg-primary-hover active:scale-[0.95]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary
              transition-all duration-150 ease-out
              focus-visible-ring"
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}