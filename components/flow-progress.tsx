"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
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

export function FlowProgress() {
  const pathname = usePathname();
  const [previousPathname] = useState(() => typeof window === "undefined" ? null : sessionStorage.getItem("in-school-loans-progress-route"));
  const progress = progressByRoute[pathname] ?? 0;
  const previousProgress = progressByRoute[previousPathname ?? ""] ?? progress;
  const startProgress = previousPathname && previousPathname !== pathname ? previousProgress : progress;
  const [displayProgress, setDisplayProgress] = useState(startProgress);

  useEffect(() => {
    sessionStorage.setItem("in-school-loans-progress-route", pathname);
    if (startProgress === progress || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const duration = 900;
    let frame = 0;
    let startTime = 0;

    const animate = (time: number) => {
      startTime ||= time;
      const elapsed = Math.min((time - startTime) / duration, 1);
      const eased = 1 - (1 - elapsed) ** 3;
      setDisplayProgress(startProgress + (progress - startProgress) * eased);
      if (elapsed < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, progress, startProgress]);

  if (!progress) return null;

  return (
    <div
      aria-label={`Application progress: ${Math.round(progress)}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(progress)}
      className={styles.progressBar}
      role="progressbar"
    >
      {Array.from({ length: 4 }, (_, index) => {
        const fill = Math.min(Math.max((displayProgress - index * 25) * 4, 0), 100);
        return <span className={styles.segment} key={index} style={{ "--fill": `${fill}%` } as CSSProperties} />;
      })}
    </div>
  );
}
