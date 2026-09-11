"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { BackLink } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const disclosures = [
  "Application Disclosure Fixed Rate",
  "Application Disclosure Variable Rate",
];

const DisclosurePdf = dynamic(() => import("./disclosure-pdf"), { ssr: false });

function DisclosureIllustration() {
  return (
    <svg aria-hidden="true" className={styles.illustration} fill="none" viewBox="0 0 180 180">
      <path d="m37 42 76-18 27 111-76 18L37 42Z" fill="#20c6c2" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
      <path d="m31 28 76-18 27 111-76 18L31 28Z" fill="#fff" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
      <path d="m67 57 31-8M62 73l43-11M67 91l43-11M72 108l34-9" stroke="#222" strokeLinecap="round" strokeWidth="4" />
      <circle cx="98" cy="59" r="18" fill="#fff" stroke="#222" strokeWidth="4" />
      <path d="m84 48 14 11 16-4M98 59v17" stroke="#222" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <rect x="116" y="61" width="43" height="69" rx="6" transform="rotate(12 116 61)" fill="#fff" stroke="#222" strokeWidth="4" />
      <path d="m128 78 22 5M126 88h24" stroke="#222" strokeLinecap="round" strokeWidth="4" />
      <circle cx="128" cy="102" r="4" fill="#222" /><circle cx="142" cy="105" r="4" fill="#222" /><circle cx="124" cy="115" r="4" fill="#222" /><circle cx="138" cy="118" r="4" fill="#222" />
    </svg>
  );
}

export default function ReviewAndSign() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [activeDisclosure, setActiveDisclosure] = useState<string | null>(null);
  const [hasReadDisclosure, setHasReadDisclosure] = useState(false);
  const [hasAcceptedDisclosure, setHasAcceptedDisclosure] = useState(false);

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  }, []);

  function openDisclosure(disclosure: string) {
    setActiveDisclosure(disclosure);
    setHasReadDisclosure(true);
    setHasAcceptedDisclosure(false);
  }

  function acceptDisclosure() {
    if (!activeDisclosure) return;

    setAccepted((current) => current.includes(activeDisclosure) ? current : [...current, activeDisclosure]);
    setActiveDisclosure(null);
  }

  return (
    <div className={styles.page}>
      <TopNav title="Student Loan Refinancing" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <DisclosureIllustration />
        <h1>Review and Acknowledge Disclosures</h1>
        <section className={styles.disclosures}>
          <p>Please view, read and acknowledge each of the Required Disclosures related to your loan application.</p>
          <div className={styles.disclosureList}>
            {disclosures.map((disclosure) => (
              <button aria-haspopup="dialog" className={styles.disclosure} key={disclosure} onClick={() => openDisclosure(disclosure)} type="button">
                <span>{disclosure}</span>
                <Badge variant={accepted.includes(disclosure) ? "success" : "default"}>{accepted.includes(disclosure) ? "Complete" : "Incomplete"}</Badge>
              </button>
            ))}
          </div>
        </section>
        <p className={styles.notice}>By clicking Continue, I acknowledge that I have read the above Disclosures.</p>
        <div className={styles.actions}>
          <BackLink href="/rates" />
          <Button disabled={accepted.length !== disclosures.length} onClick={() => router.push("/reviewing")} size="base">Continue</Button>
        </div>
      </main>
      {activeDisclosure ? (
        <div className={styles.modalBackdrop} onClick={() => setActiveDisclosure(null)} role="presentation">
          <section aria-labelledby="disclosure-title" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog">
            <header className={styles.modalHeader}>
              <div>
                <strong id="disclosure-title">{activeDisclosure}</strong>
                <span>Private Student Loan Application and Solicitation Disclosure</span>
              </div>
            </header>
            {!hasReadDisclosure ? <div className={styles.scrollHint}>Scroll to the bottom to accept</div> : null}
            <DisclosurePdf src={activeDisclosure === disclosures[0] ? "/fixed_rate_disclosure.pdf" : "/variable_rate_disclosure.pdf"} title={activeDisclosure} />
            <footer className={styles.modalFooter}>
              <label className={styles.acceptance}>
                <input checked={hasAcceptedDisclosure} disabled={!hasReadDisclosure} onChange={(event) => setHasAcceptedDisclosure(event.target.checked)} type="checkbox" />
                <span>By clicking “Accept &amp; Close”, I acknowledge that I have read this disclosure.</span>
              </label>
              <Button disabled={!hasAcceptedDisclosure} fullWidth onClick={acceptDisclosure} size="base">Accept &amp; Close</Button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
