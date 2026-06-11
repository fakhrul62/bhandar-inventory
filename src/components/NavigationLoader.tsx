"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isSamePageUrl(url: URL) {
  return (
    url.origin === window.location.origin &&
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  );
}

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function startLoading() {
      setLoading(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setLoading(false), 12_000);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (isSamePageUrl(url)) return;

      startLoading();
    }

    function handleSubmit(event: SubmitEvent) {
      if (event.defaultPrevented) return;
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      const action = form.getAttribute("action");
      if (action && action.startsWith("http") && !action.startsWith(window.location.origin)) return;
      startLoading();
    }

    window.addEventListener("click", handleClick, true);
    window.addEventListener("submit", handleSubmit, true);

    return () => {
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("submit", handleSubmit, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Loading destination"
      className="fixed bottom-5 left-5 z-[9999] flex items-center gap-3 rounded-full border border-emerald-900/10 bg-white/95 px-3 py-2 text-sm font-medium text-slate-800 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-md"
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute h-9 w-9 animate-spin rounded-full border-2 border-dashed border-[#0f6b3a]" />
        <span className="absolute h-6 w-6 animate-[spin_0.8s_linear_infinite_reverse] rounded-full border-2 border-dashed border-[#f5a623]" />
        <span className="h-2 w-2 rounded-full bg-[#0f6b3a]" />
      </span>
      <span className="pr-1">Loading</span>
    </div>
  );
}
