"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import { storageKeys, useStoredUser, useStoredValue } from "@/lib/storage";
import styles from "./page.module.css";

const informationRows = [
  { label: "Employment", href: "/employment-details" },
  { label: "Address", href: "/address-details" },
] as const;

export default function AdditionalInfoNeeded() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const employmentComplete = useStoredValue(storageKeys.employmentComplete) === "true";
  const addressComplete = useStoredValue(storageKeys.addressComplete) === "true";
  const [selectedRow, setSelectedRow] = useState<(typeof informationRows)[number] | null>(null);
  const [showSavedNotice, setShowSavedNotice] = useState(true);
  const [savedNoticeFading, setSavedNoticeFading] = useState(false);
  const allInformationComplete = employmentComplete && addressComplete;
  const completedRows: Record<(typeof informationRows)[number]["label"], boolean> = {
    Address: addressComplete,
    Employment: employmentComplete,
  };

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
      <TopNav title="In-School Loan" userName={fullName} />
      {showSavedNotice ? (
        <aside className={`${styles.savedNotice} ${savedNoticeFading ? styles.savedNoticeFading : ""}`} role="status">
          <span>Your application progress has been saved. To go back, review your application in the dashboard.</span>
          <button aria-label="Close saved progress notification" onClick={dismissSavedNotice} type="button">×</button>
        </aside>
      ) : null}
      <main className={styles.main}>
        <Image alt="" className={styles.illustration} height={180} priority src="/additiona_info.svg" width={180} />
        <h1>Additional information is required</h1>
        <p>Please help us clarify some of your responses.</p>
        <section className={styles.additionalInformation}>
          <div className={styles.informationTable}>
            {informationRows.map((row) => {
              const isComplete = completedRows[row.label];

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
