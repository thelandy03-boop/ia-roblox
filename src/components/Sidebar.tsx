"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "New Chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/memory",
    label: "Memory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L4.5 3.5 2 6v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-2-2h-4L8 2H6z" />
        <line x1="2" y1="22" x2="22" y2="22" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const bottomItems: NavItem[] = [
  {
    href: "/help",
    label: "Help & Docs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    href: "/api",
    label: "API Keys",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 8h12M6 12h10M6 16h8" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) {
          return JSON.parse(saved) as boolean;
        }
      } catch {
        return false;
      }
    }
    return false;
  });
  const sidebarRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const navLinks = sidebarRef.current?.querySelectorAll(".nav-item");
      if (navLinks) {
        gsap.from(navLinks, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
        });
      }
    }, sidebarRef);
    return () => ctx.revert();
  }, [isCollapsed]);

  const handleToggle = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newValue));
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
    const linkRef = useRef<HTMLAnchorElement>(null);

    useGSAP(() => {
      if (isActive && linkRef.current) {
        gsap.from(linkRef.current, {
          backgroundColor: "var(--primary)",
          color: "var(--background)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }, [isActive]);

    return (
      <Link
        ref={linkRef}
        href={item.href}
        className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200 ease-out
          hover:bg-muted hover:text-foreground
          focus-visible-ring
          ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"}
          ${isCollapsed ? "justify-center" : ""}`}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
        {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
        {item.badge && !isCollapsed && (
          <span className="ml-auto px-2 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-0 z-40 h-full bg-background border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-[var(--sidebar-width)]"}
        flex flex-col overflow-hidden`}
      aria-label="Main navigation"
    >
      <div className="flex h-[var(--header-height)] items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <span className="font-semibold text-lg tracking-tight text-foreground flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <span>Raven AI</span>
          </span>
        )}
        {isCollapsed && (
          <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
        )}
        <button
          ref={toggleRef}
          onClick={handleToggle}
          className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center focus-visible-ring"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isCollapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navigation">
        <div className="px-2 py-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="border-t border-border my-3" />

        <div className="px-2 py-1 space-y-1">
          {bottomItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-border" style={{ display: isCollapsed ? "none" : "block" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-muted">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">Developer</p>
            <p className="text-xs text-muted-foreground truncate">Pro Plan • 2,847 credits</p>
          </div>
        </div>
      </div>
    </aside>
  );
}