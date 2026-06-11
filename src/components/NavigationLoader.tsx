"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MIN_VISIBLE_MS = 700;
const SETTLE_HIDE_DELAY_MS = 160;
const SAFETY_TIMEOUT_MS = 15_000;

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
  const loadingRef = useRef(false);
  const startedAtRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loadingRef.current) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    const elapsed = Date.now() - startedAtRef.current;
    const minimumRemaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const hideDelay = Math.max(SETTLE_HIDE_DELAY_MS, minimumRemaining);

    hideTimeoutRef.current = setTimeout(() => {
      loadingRef.current = false;
      setLoading(false);
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }, hideDelay);
  }, [pathname, searchParams]);

  useEffect(() => {
    function startLoading() {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (!loadingRef.current) {
        startedAtRef.current = Date.now();
        loadingRef.current = true;
      }

      setLoading(true);
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      safetyTimeoutRef.current = setTimeout(() => {
        loadingRef.current = false;
        setLoading(false);
      }, SAFETY_TIMEOUT_MS);
    }

    function stopLoading() {
      loadingRef.current = false;
      setLoading(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }

    function getAnchor(target: EventTarget | null) {
      if (!(target instanceof Element)) return null;
      return target.closest("a[href]") as HTMLAnchorElement | null;
    }

    function shouldStartForAnchor(anchor: HTMLAnchorElement) {
      if (anchor.target && anchor.target !== "_self") return false;
      if (anchor.hasAttribute("download")) return false;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return false;
      if (isSamePageUrl(url)) return false;

      return true;
    }

    function shouldStartForHistoryUrl(url: string | URL | null | undefined) {
      if (!url) return false;

      const nextUrl = new URL(url, window.location.href);
      if (nextUrl.origin !== window.location.origin) return false;
      if (isSamePageUrl(nextUrl)) return false;

      return true;
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = getAnchor(event.target);
      if (!anchor || !shouldStartForAnchor(anchor)) return;

      startLoading();
    }

    function handlePointerDown(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = getAnchor(event.target);
      if (!anchor || !shouldStartForAnchor(anchor)) return;

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

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      if (shouldStartForHistoryUrl(args[2])) {
        startLoading();
      }
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function replaceState(...args) {
      if (shouldStartForHistoryUrl(args[2])) {
        startLoading();
      }
      return originalReplaceState.apply(this, args);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    window.addEventListener("popstate", startLoading);
    window.addEventListener("pageshow", stopLoading);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      window.removeEventListener("popstate", startLoading);
      window.removeEventListener("pageshow", stopLoading);
      stopLoading();
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
