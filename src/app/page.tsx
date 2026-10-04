"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChatArea } from "@/components/ChatArea";
import { InputArea } from "@/components/InputArea";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeInputArea } from "@/components/WelcomeInputArea";
import { SuggestionChips } from "@/components/SuggestionChips";
import { WelcomeScreen } from "@/components/WelcomeScreen";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function simulateStreamingResponse(userMessage: string): AsyncGenerator<string> {
  async function* generator() {
    const responses = [
      "I'll help you build that in Roblox. Let me break this down into steps.",
      "First, I'll create the core structure with proper architecture.",
      "Then add the gameplay mechanics you need.",
      "Finally, I'll optimize and add polish.",
    ];

    let fullResponse = "";
    for (const chunk of responses) {
      for (const word of chunk.split(" ")) {
        fullResponse += word + " ";
        yield fullResponse;
        await new Promise((r) => setTimeout(r, 30 + Math.random() * 50));
      }
    }
  }
  return generator();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowWelcome(false);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const stream = simulateStreamingResponse(content);
      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, content: chunk } : msg
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, isStreaming: false } : msg
        )
      );
      setIsLoading(false);
    }
  }, [isLoading]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".welcome-enter", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 ml-[var(--sidebar-width)] transition-all duration-300">
        <header className="h-[var(--header-height)] border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-foreground">New Chat</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg hover:bg-muted transition-colors flex items-center justify-center focus-visible-ring" aria-label="New chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          {mounted ? (
            <>
              {showWelcome && messages.length === 0 ? (
                <WelcomeScreen
                  onSuggestionClick={handleSend}
                  onGenerate={handleSend}
                  className="welcome-enter flex-1 flex flex-col"
                />
              ) : (
                <>
                  <ChatArea
                    messages={messages}
                    isLoading={isLoading}
                    scrollRef={scrollAreaRef}
                  />
                  <InputArea
                    onSend={handleSend}
                    disabled={isLoading}
                    placeholder="Message Raven AI..."
                  />
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col min-h-0" />
          )}
        </div>
      </main>
    </div>
  );
}