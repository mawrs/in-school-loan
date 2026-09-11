"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import styles from "./flow-progress.module.css";

const progressByRoute: Record<string, number> = {
  "/loan-info": 12.5,
  "/loan-eligibility": 25,
  "/verification": 37.5,
  "/address": 50,
  "/school": 62.5,
  "/identity": 75,
  "/co-signer": 83.33,
  "/co-signer-details": 91.67,
  "/income": 91.67,
  "/review": 100,
};

const previousRouteKey = "in-school-loans-progress-route";
const segmentCount = 4;
const segmentSpan = 100 / segmentCount;

function segmentFill(progress: number, index: number) {
  return `${Math.min(Math.max(((progress - index * segmentSpan) / segmentSpan) * 100, 0), 100)}%`;
}

function paintSegments(segments: HTMLElement[], progress: number) {
  segments.forEach((segment, index) => segment.style.setProperty("--fill", segmentFill(progress, index)));
}

export function FlowProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const progress = progressByRoute[pathname] ?? 0;

  // The animation is driven directly on the DOM so the server markup (final value) matches the
  // client on hydration; the starting point comes from the previously visited step. The previous
  // route is cached in a ref so a re-run of the effect (e.g. StrictMode) animates the same way.
  useLayoutEffect(() => {
    previousPathnameRef.current ??= sessionStorage.getItem(previousRouteKey) ?? pathname;
    const previousPathname = previousPathnameRef.current;
    sessionStorage.setItem(previousRouteKey, pathname);

    const segments = [...(barRef.current?.querySelectorAll<HTMLElement>(`.${styles.segment}`) ?? [])];
    const startProgress = previousPathname !== pathname ? progressByRoute[previousPathname] ?? progress : progress;
    if (!segments.length || startProgress === progress || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    paintSegments(segments, startProgress);

    const duration = 900;
    let frame = 0;
    let startTime = 0;

    const animate = (time: number) => {
      startTime ||= time;
      const elapsed = Math.min((time - startTime) / duration, 1);
      const eased = 1 - (1 - elapsed) ** 3;
      paintSegments(segments, startProgress + (progress - startProgress) * eased);
      if (elapsed < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      paintSegments(segments, progress);
    };
  }, [pathname, progress]);

  if (!progress) return null;

  return (
    <div
      aria-label={`Application progress: ${Math.round(progress)}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(progress)}
      className={styles.progressBar}
      ref={barRef}
      role="progressbar"
    >
      {Array.from({ length: segmentCount }, (_, index) => (
        <span className={styles.segment} key={index} style={{ "--fill": segmentFill(progress, index) } as CSSProperties} />
      ))}
    </div>
  );
}
