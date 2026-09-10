"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function parseAmount(value: string | null, fallback: number) {
  const amount = Number(value?.replaceAll(",", ""));
  return Number.isFinite(amount) && amount > 0 ? amount : fallback;
}

function formatAmount(value: number, cents = false) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: cents ? 2 : 0,
    minimumFractionDigits: cents ? 2 : 0,
    style: "currency",
  }).format(value);
}

export default function LoanEligibility() {
  const router = useRouter();
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "" : localStorage.getItem("in-school-loans-user-last-name") || ""),
  );
  const [costOfAttendance] = useState(
    () => parseAmount(typeof window === "undefined" ? null : localStorage.getItem("in-school-loans-cost-of-attendance"), 25000),
  );
  const [financialAid] = useState(
    () => parseAmount(typeof window === "undefined" ? null : localStorage.getItem("in-school-loans-financial-aid"), 13024),
  );
  const eligibleAmount = Math.max(0, costOfAttendance - financialAid);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const minimumAmount = Math.min(5000, eligibleAmount);
  const [requestedAmount, setRequestedAmount] = useState(eligibleAmount);
  const sliderPosition =
    eligibleAmount === minimumAmount
      ? 100
      : ((requestedAmount - minimumAmount) / (eligibleAmount - minimumAmount)) * 100;

  return (
    <div className={styles.page}>
      <TopNav
        title="In-School Loan"
        userName={fullName}
      />
      <div className={styles.progressBar} aria-label="Step 1 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index === 0 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.header}>
            <Stepper currentStep={1} />
            <div className={styles.title}>
              <h1>You&apos;re eligible to borrow up to {formatAmount(eligibleAmount, true)}</h1>
              <p>Why {formatAmount(eligibleAmount, true)}? This number is the difference between your cost of attendance and your financial aid.</p>
            </div>
          </div>
          <section className={styles.review} aria-label="Eligibility calculation">
            <div><span>Cost of Attendance</span><strong>{formatAmount(costOfAttendance)}</strong></div>
            <div><span>Financial Aid</span><strong className={styles.aidAmount}>− {formatAmount(financialAid)}</strong></div>
            <div><strong>Max Borrow Amount</strong><strong className={styles.eligibleAmount}>= {formatAmount(eligibleAmount)}</strong></div>
          </section>
          <div className={styles.amountPicker}>
            <output
              style={{
                left: `${sliderPosition}%`,
              }}
            >
              {formatAmount(requestedAmount)}
            </output>
            <input
              aria-label="Requested loan amount"
              max={eligibleAmount}
              min={minimumAmount}
              onChange={(event) => setRequestedAmount(Number(event.target.value))}
              type="range"
              value={requestedAmount}
            />
            <div><span>{formatAmount(minimumAmount)}</span><span>{formatAmount(eligibleAmount)}</span></div>
          </div>
        </section>
        <div className={styles.actions}>
          <BackLink href="/loan-info" />
          <Button onClick={() => router.push("/verification")} size="base">Next</Button>
        </div>
      </main>
    </div>
  );
}
