"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { Dropdown } from "@/components/dropdown";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { readApplicationDraft, readStoredValue, setStoredValue, storageKeys, updateApplicationDraft, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const employmentStatuses = [
  "Employed-Salaried",
  "Employed-Commission Only",
  "Self-Employed",
  "Retired",
  "Unemployed/Full Time Student",
];

const minimumIncomeWithoutCoSigner = 35000;

function parseIncome(value: string) {
  const amount = Number(value.replaceAll(",", ""));
  return Number.isFinite(amount) ? amount : Number.NaN;
}

export default function Income() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [income, setIncome] = useState("");
  const [incomeBlurred, setIncomeBlurred] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [declinedCoSigner, setDeclinedCoSigner] = useState(false);

  useEffect(() => {
    const draft = readApplicationDraft();
    setIncome(readStoredValue(storageKeys.annualIncome) ?? "");
    setEmploymentStatus(draft.employmentStatus);
    setDeclinedCoSigner(draft.hasCoSigner !== "true");
  }, []);

  const incomeIsTooLow =
    declinedCoSigner && income !== "" && parseIncome(income) < minimumIncomeWithoutCoSigner;
  const incomeError = incomeBlurred && incomeIsTooLow
    ? "Your income is too low and requires a co-signer."
    : undefined;

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if (incomeIsTooLow) {
              setIncomeBlurred(true);
              return;
            }
            setStoredValue(storageKeys.annualIncome, income);
            router.push("/review");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={3} />
            <div>
              <h1>What is your estimated annual income?</h1>
              <p>Your estimated annual income is individual income, NOT household income. If you are unsure what your estimated annual income is, please look at your previous W-2 form.</p>
            </div>
          </div>
          <CurrencyInput
            error={incomeError}
            label="Estimated annual income"
            name="estimatedAnnualIncome"
            onBlur={() => setIncomeBlurred(true)}
            onFocus={() => setIncomeBlurred(false)}
            onValueChange={(value) => {
              setIncome(value);
              setStoredValue(storageKeys.annualIncome, value);
            }}
            required
            value={income}
          />
          <div className={styles.employment}>
            <span>What&apos;s your employment status?</span>
            <Dropdown
              label="Employment Status"
              name="employmentStatus"
              onValueChange={(value) => {
                setEmploymentStatus(value);
                updateApplicationDraft({ employmentStatus: value });
              }}
              options={employmentStatuses}
              placeholder="Please Select"
              value={employmentStatus}
            />
          </div>
          <div className={styles.actions}>
            <BackLink href="/co-signer" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
