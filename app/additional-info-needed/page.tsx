"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const informationRows = [
  { label: "Employment", href: "/income" },
  { label: "Address", href: "/address" },
];

function AdditionalInfoIllustration() {
  return (
    <svg aria-hidden="true" className={styles.illustration} fill="none" viewBox="0 0 180 180">
      <path d="m37 33 89-12 17 111-89 12L37 33Z" fill="#fff" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
      <path d="m58 58 11 10 17-22M63 92l11 10 17-22M69 123l11 10 17-22" stroke="#222" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <rect x="54" y="48" width="25" height="20" rx="3" stroke="#222" strokeWidth="4" /><rect x="59" y="82" width="25" height="20" rx="3" stroke="#222" strokeWidth="4" /><rect x="64" y="113" width="25" height="20" rx="3" stroke="#222" strokeWidth="4" />
      <path d="m99 58 28-4M102 75l26-4M107 94l26-4M110 111l23-3" stroke="#222" strokeLinecap="round" strokeWidth="4" />
      <path d="m97 84 50-43 9 10-50 43Z" fill="#20c6c2" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
      <path d="m144 38 9 10 10-13-7-7-12 10ZM97 84l9 10-16 7 7-17Z" fill="#20c6c2" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
      <path d="M75 145 146 132l-7 14-60 12-4-13Z" fill="#222" stroke="#222" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

export default function AdditionalInfoNeeded() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");
  const [selectedRow, setSelectedRow] = useState<typeof informationRows[number] | null>(null);
  const [employmentComplete, setEmploymentComplete] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [showSavedNotice, setShowSavedNotice] = useState(true);
  const [savedNoticeFading, setSavedNoticeFading] = useState(false);
  const allInformationComplete = employmentComplete && addressComplete;

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
    setEmploymentComplete(localStorage.getItem("in-school-loans-employment-complete") === "true");
    setAddressComplete(localStorage.getItem("in-school-loans-address-complete") === "true");
  }, []);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSavedNoticeFading(true), 4500);
    const removeTimer = window.setTimeout(() => setShowSavedNotice(false), 5000);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  function dismissSavedNotice() {
    setSavedNoticeFading(true);
    window.setTimeout(() => setShowSavedNotice(false), 500);
  }

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      {showSavedNotice ? (
        <aside className={`${styles.savedNotice} ${savedNoticeFading ? styles.savedNoticeFading : ""}`} role="status">
          <span>Your application progress has been saved. To go back, review your application in the dashboard.</span>
          <button aria-label="Close saved progress notification" onClick={dismissSavedNotice} type="button">×</button>
        </aside>
      ) : null}
      <main className={styles.main}>
        <AdditionalInfoIllustration />
        <h1>Additional information is required</h1>
        <p>Please help us clarify some of your responses.</p>
        <section className={styles.additionalInformation}>
          <div className={styles.informationTable}>
            {informationRows.map((row) => {
              const isComplete = (row.label === "Employment" && employmentComplete)
                || (row.label === "Address" && addressComplete);

              return (
                <button aria-pressed={selectedRow?.label === row.label} className={styles.informationRow} disabled={isComplete} key={row.label} onClick={() => setSelectedRow((current) => current?.label === row.label ? null : row)} type="button">
                  <span>{row.label}</span>
                  <Badge variant={isComplete ? "success" : "default"}>{isComplete ? "Complete" : "Incomplete"}</Badge>
                </button>
              );
            })}
          </div>
        </section>
        <div className={styles.actions}>
          <Button
            disabled={!allInformationComplete && !selectedRow}
            onClick={() => {
              if (allInformationComplete) {
                router.push("/final-agreements");
              } else if (selectedRow) {
                router.push(selectedRow.href);
              }
            }}
            size="base"
          >
            {allInformationComplete ? "Next" : selectedRow ? `Confirm ${selectedRow.label} information` : "Continue"}
          </Button>
        </div>
      </main>
    </div>
  );
}
