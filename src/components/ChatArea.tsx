"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatArea({ messages, isLoading, scrollRef }: ChatAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(".message-enter");
      if (elements?.length) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.05 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [messages.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={scrollRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

function MessageBubble({ message, index }: MessageBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(bubbleRef.current, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      ease: "power2.out",
      delay: index * 0.03,
    });
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      ref={bubbleRef}
      className={`message-enter flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse ml-auto" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          message.role === "user"
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
        aria-hidden="true"
      >
        {message.role === "user" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`prose prose-invert max-w-none ${
            message.role === "user" ? "text-right" : ""
          }`}
        >
          <div className={message.isStreaming ? "whitespace-pre-wrap" : ""}>
            {message.content}
          </div>
        </div>
        <time className="text-xs text-muted-foreground mt-1 block" dateTime={message.timestamp.toISOString()}>
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
}

function TypingIndicator() {
  const dotsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const children = dotsRef.current?.children;
      if (children?.length) {
        gsap.to(children, {
          opacity: 0.3,
          duration: 0.6,
          ease: "power1.inOut",
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
        });
      }
    }, dotsRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex gap-3 max-w-[85%]">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      </div>
      <div className="bg-card rounded-2xl px-5 py-3 flex items-center gap-1" ref={dotsRef}>
        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
      </div>
    </div>
  );
}