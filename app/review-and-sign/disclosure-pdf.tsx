"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./page.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function DisclosurePdf({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(640);
  const [contentHeight, setContentHeight] = useState<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(Math.floor(entry.contentRect.width));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function trimWhitespace() {
    requestAnimationFrame(() => {
      const page = containerRef.current?.querySelector(".react-pdf__Page");
      const text = [...(containerRef.current?.querySelectorAll(".react-pdf__Page__textContent span") ?? [])];
      if (!page || !text.length) return;

      const pageTop = page.getBoundingClientRect().top;
      const lastLine = Math.max(...text.map((element) => element.getBoundingClientRect().bottom - pageTop));
      setContentHeight((current) => Math.max(current ?? 0, Math.ceil(lastLine + 16)));
    });
  }

  return (
    <div aria-label={title} className={styles.disclosurePdf} ref={containerRef} role="document">
      <div className={styles.pdfCrop} style={contentHeight ? { height: contentHeight } : undefined}>
        <Document file={src} loading="Loading disclosure…" noData="Disclosure is unavailable.">
          <Page onRenderTextLayerSuccess={trimWhitespace} pageNumber={1} width={pageWidth} />
        </Document>
      </div>
    </div>
  );
}
