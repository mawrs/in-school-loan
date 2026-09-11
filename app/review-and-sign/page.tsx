"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { BackLink } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const disclosures = [
  "Application Disclosure Fixed Rate",
  "Application Disclosure Variable Rate",
];

const DisclosurePdf = dynamic(() => import("./disclosure-pdf"), { ssr: false });

export default function ReviewAndSign() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [accepted, setAccepted] = useState<string[]>([]);
  const [activeDisclosure, setActiveDisclosure] = useState<string | null>(null);
  const [hasReadDisclosure, setHasReadDisclosure] = useState(false);
  const [hasAcceptedDisclosure, setHasAcceptedDisclosure] = useState(false);

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
      <TopNav title="In-School Loan" userName={fullName} />
      <main className={styles.main}>
        <Image alt="" className={styles.illustration} height={180} priority src="/agreements.svg" width={180} />
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
            <DisclosurePdf key={activeDisclosure} src={activeDisclosure === disclosures[0] ? "/fixed_rate_disclosure.pdf" : "/variable_rate_disclosure.pdf"} title={activeDisclosure} />
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
