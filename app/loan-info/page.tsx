"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { FlowProgress } from "@/components/flow-progress";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { readStoredValue, setStoredValue, storageKeys, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const minimumLoanAmount = 1000;
const maximumLoanAmount = 200000;
const supportPhone = "(844) 601-3534";

const costSheetRows = [
  ["Tuition & fees", "$"],
  ["Housing & food", "$"],
  ["Books & supplies", "$"],
  ["Transportation", "$"],
  ["Other expenses", "$"],
] as const;

function currencyValue(value: string) {
  const amount = Number(value.replaceAll(",", ""));
  return Number.isFinite(amount) ? amount : 0;
}

function CalculatorIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="18" rx="2" stroke="currentColor" strokeWidth="1.7" width="14" x="5" y="3" />
      <path d="M8 7.5h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path
        d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.2 3.8h1.8c.5 0 .9.3 1 .8l.6 2.2a1 1 0 0 1-.6 1.1l-1.3.6a9.6 9.6 0 0 0 4.8 4.8l.6-1.3a1 1 0 0 1 1.1-.6l2.2.6c.5.1.8.5.8 1v1.8A1.4 1.4 0 0 1 16.8 16 12.2 12.2 0 0 1 5 4.2a1.4 1.4 0 0 1 1.4-1.4h.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 16.5 4 19V6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8A1.5 1.5 0 0 1 18.5 16H8.2L6 16.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M8 9.5h.01M12 9.5h.01M16 9.5h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

function CostSheet() {
  return (
    <svg aria-hidden="true" className={styles.costSheet} viewBox="0 0 280 210">
      <ellipse cx="146" cy="112" fill="var(--color-success)" opacity="0.16" rx="86" ry="64" />
      <ellipse cx="112" cy="132" fill="var(--color-success)" opacity="0.12" rx="48" ry="34" />
      <g stroke="var(--color-success)" strokeLinecap="round" strokeWidth="3">
        <path d="M46 62 34 52M38 84 24 86M50 104 38 114M236 50l12-10M246 74l14 2M232 96l12 10" />
      </g>
      <g transform="rotate(-7 132 112)">
        <rect fill="var(--background-white)" height="148" rx="6" stroke="var(--color-success)" strokeWidth="8" width="146" x="62" y="38" />
      </g>
      <g transform="rotate(3 154 108)">
        <rect fill="var(--background-white)" height="158" rx="4" stroke="var(--text-heading)" strokeWidth="2" width="156" x="74" y="26" />
        <text fill="var(--text-heading)" fontSize="12" fontWeight="700" x="88" y="48">
          Education Costs
        </text>
        {costSheetRows.map(([label, amount], index) => (
          <g key={label}>
            <text fill="var(--text-heading)" fontSize="10" x="88" y={68 + index * 16}>
              {label}
            </text>
            <text fill="var(--text-heading)" fontSize="10" textAnchor="end" x="214" y={68 + index * 16}>
              {amount}
            </text>
          </g>
        ))}
        <text fill="var(--text-heading)" fontSize="10" x="88" y="152">
          – Financial aid
        </text>
        <text fill="var(--text-heading)" fontSize="10" textAnchor="end" x="214" y="152">
          – $
        </text>
        <path d="M88 160h126" stroke="var(--text-heading)" strokeWidth="1.5" />
        <text fill="var(--text-heading)" fontSize="11" fontWeight="700" x="88" y="174">
          = Amount to borrow
        </text>
        <text fill="var(--text-heading)" fontSize="11" fontWeight="700" textAnchor="end" x="214" y="174">
          $
        </text>
      </g>
    </svg>
  );
}

function formatWholeAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export default function LoanInfo() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [costOfAttendance, setCostOfAttendance] = useState("");
  const [estimatedFinancialAid, setEstimatedFinancialAid] = useState("");
  const loanValue = currencyValue(loanAmount);
  const costAmount = currencyValue(costOfAttendance);
  const financialAidAmount = currencyValue(estimatedFinancialAid);
  const hasEducationCosts = costOfAttendance !== "" && estimatedFinancialAid !== "";
  const eligibleAmount = Math.max(0, costAmount - financialAidAmount);
  const financialAidError =
    costAmount > 0 && financialAidAmount > costAmount
      ? "Financial aid cannot be greater than cost of attendance."
      : undefined;
  const loanAmountError =
    loanAmount !== "" && loanValue < minimumLoanAmount
      ? `Enter at least ${formatWholeAmount(minimumLoanAmount)}.`
      : loanValue > maximumLoanAmount
        ? `You can request up to ${formatWholeAmount(maximumLoanAmount)}.`
        : hasEducationCosts && !financialAidError && loanValue > eligibleAmount
          ? "Loan amount can't be more than your cost of attendance minus financial aid."
          : undefined;

  useEffect(() => {
    setLoanAmount(readStoredValue(storageKeys.loanAmount) ?? "");
    setCostOfAttendance(readStoredValue(storageKeys.costOfAttendance) ?? "");
    setEstimatedFinancialAid(readStoredValue(storageKeys.financialAid) ?? "");
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (financialAidError || loanAmountError || loanAmount === "") {
      return;
    }

    setStoredValue(storageKeys.loanAmount, loanAmount);
    setStoredValue(storageKeys.costOfAttendance, costOfAttendance);
    setStoredValue(storageKeys.financialAid, estimatedFinancialAid);
    router.push("/verification");
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
              <h1>How much would you like to borrow?</h1>
              <p>Enter the amount you need for your education expenses after financial aid.</p>
            </div>
          </div>
          <CurrencyInput
            error={loanAmountError}
            label="Loan amount"
            name="loanAmount"
            onValueChange={(value) => {
              setLoanAmount(value);
              setStoredValue(storageKeys.loanAmount, value);
            }}
            required
            value={loanAmount}
          />
          <section className={styles.section} aria-labelledby="education-costs-heading">
            <h2 id="education-costs-heading">Tell us about your education costs and financial aid</h2>
            <div className={styles.costFields}>
              <div>
                <CurrencyInput
                  id="cost-of-attendance"
                  label="Estimated cost of attendance"
                  name="costOfAttendance"
                  onValueChange={(value) => {
                    setCostOfAttendance(value);
                    setStoredValue(storageKeys.costOfAttendance, value);
                  }}
                  required
                  value={costOfAttendance}
                />
                <p className={styles.hint}>
                  Your school&apos;s cost of attendance (COA) generally includes tuition, fees, books and supplies, housing and food, transportation, and other reasonable expenses.
                </p>
              </div>
              <div>
                <CurrencyInput
                  error={financialAidError}
                  id="estimated-financial-aid"
                  label="Estimated financial aid"
                  name="estimatedFinancialAid"
                  onValueChange={(value) => {
                    setEstimatedFinancialAid(value);
                    setStoredValue(storageKeys.financialAid, value);
                  }}
                  required
                  value={estimatedFinancialAid}
                />
                <p className={styles.hint}>
                  Include grants, scholarships, and other aid you expect to receive. You can exclude loans, work-study, and personal savings.
                </p>
              </div>
            </div>
          </section>
          <output className={styles.remainingNeed} htmlFor="cost-of-attendance estimated-financial-aid">
            <div className={styles.remainingNeedAmount}>
              <CalculatorIcon />
              <div>
                <span>Estimated remaining need</span>
                <strong>{formatWholeAmount(hasEducationCosts ? eligibleAmount : 0)}</strong>
              </div>
            </div>
            <p>This is an estimate only. Your school will confirm your final eligible loan amount.</p>
          </output>
          <div className={styles.actions}>
            <Button size="base" type="submit">
              Next
            </Button>
          </div>
        </form>
        <aside className={styles.helpPanel}>
          <div className={styles.helpIntro}>
            <h2>Not sure how much you need?</h2>
            <p>That&apos;s okay.</p>
          </div>
          <p className={styles.helpCopy}>
            Use your school&apos;s estimated cost of attendance and subtract any grants, scholarships, or other aid. You can always adjust the amount later, and your school will confirm your final eligible loan amount before funds are sent.
          </p>
          <CostSheet />
          <div className={styles.helpContact}>
            <h3>Need help?</h3>
            <p>We&apos;re here to help.</p>
            <a className={styles.helpLink} href="tel:+18446013534">
              <PhoneIcon />
              {supportPhone}
            </a>
            <button className={styles.helpLink} onClick={() => setIsSupportOpen(true)} type="button">
              <ChatIcon />
              Chat with us
            </button>
          </div>
        </aside>
        {isSupportOpen ? (
          <div
            className={styles.dialogBackdrop}
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsSupportOpen(false);
            }}
            role="presentation"
          >
            <section aria-labelledby="support-title" aria-modal="true" className={styles.dialog} role="dialog">
              <button aria-label="Close support dialog" className={styles.closeButton} onClick={() => setIsSupportOpen(false)} type="button">
                ×
              </button>
              <h2 id="support-title">Contact support</h2>
              <p className={styles.supportPhone}>{supportPhone}</p>
              <p>We only offer phone support for now.</p>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
