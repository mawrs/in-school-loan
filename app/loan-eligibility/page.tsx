"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AmountSlider } from "@/components/amount-slider";
import { Button } from "@/components/button";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { storageKeys, useStoredUser, useStoredValue } from "@/lib/storage";
import styles from "./page.module.css";

function parseAmount(value: string, fallback: number) {
  const amount = Number(value.replaceAll(",", ""));
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
  const { fullName } = useStoredUser();
  const costOfAttendance = parseAmount(useStoredValue(storageKeys.costOfAttendance), 25000);
  const financialAid = parseAmount(useStoredValue(storageKeys.financialAid), 13024);
  const eligibleAmount = Math.max(0, costOfAttendance - financialAid);
  const minimumAmount = Math.min(5000, eligibleAmount);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const requestedAmount = Math.min(selectedAmount ?? eligibleAmount, eligibleAmount);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
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
          <AmountSlider
            ariaLabel="Requested loan amount"
            formatValue={(value) => formatAmount(value)}
            max={eligibleAmount}
            maxLabel={formatAmount(eligibleAmount)}
            min={minimumAmount}
            minLabel={formatAmount(minimumAmount)}
            onChange={setSelectedAmount}
            value={requestedAmount}
          />
        </section>
        <div className={styles.actions}>
          <BackLink href="/loan-info" />
          <Button onClick={() => router.push("/verification")} size="base">Next</Button>
        </div>
      </main>
    </div>
  );
}
