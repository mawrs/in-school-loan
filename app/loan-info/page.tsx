"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { setStoredValue, storageKeys, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

function currencyValue(value: string) {
  return Number(value.replaceAll(",", ""));
}

export default function LoanInfo() {
  const router = useRouter();
  const { firstName, fullName } = useStoredUser();
  const [costOfAttendance, setCostOfAttendance] = useState("");
  const [estimatedFinancialAid, setEstimatedFinancialAid] = useState("");
  const costAmount = currencyValue(costOfAttendance);
  const financialAidAmount = currencyValue(estimatedFinancialAid);
  const financialAidError =
    costAmount > 0 && financialAidAmount > costAmount
      ? "Financial aid cannot be greater than cost of attendance."
      : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (financialAidError) {
      return;
    }

    setStoredValue(storageKeys.costOfAttendance, costOfAttendance);
    setStoredValue(storageKeys.financialAid, estimatedFinancialAid);
    router.push("/loan-eligibility");
  };

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.header}>
            <Stepper currentStep={1} />
            <div className={styles.title}>
              <h1>Nice to meet you, {firstName}. What&apos;s your cost of attendance?</h1>
              <p>
                If you are not sure about your cost of attendance or financial aid, please check
                with your financial aid office.
              </p>
            </div>
          </div>
          <div className={styles.fields}>
            <CurrencyInput
              label="Cost of attendance"
              name="costOfAttendance"
              onValueChange={setCostOfAttendance}
              value={costOfAttendance}
            />
            <CurrencyInput
              label="Estimated financial aid"
              name="estimatedFinancialAid"
              error={financialAidError}
              onValueChange={setEstimatedFinancialAid}
              value={estimatedFinancialAid}
            />
          </div>
          <div className={styles.actions}>
            <BackLink href="/dashboard" />
            <Button size="base" type="submit">
              Next
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
