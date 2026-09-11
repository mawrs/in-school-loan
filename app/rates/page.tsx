"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

type Rate = {
  apr: number;
  payment: string;
  term: string;
  total: string;
};

const fixedRates: Rate[] = [
  { apr: 9.2, payment: "$415.17", term: "5 years", total: "$37,898" },
  { apr: 6.89, payment: "$451.17", term: "7 years", total: "$37,898" },
  { apr: 7.49, payment: "$355.95", term: "10 years", total: "$42,714" },
  { apr: 8.24, payment: "$290.87", term: "15 years", total: "$52,356" },
];

const variableRates: Rate[] = [
  { apr: 8.86, payment: "$620.71", term: "5 Year Term", total: "$37,243" },
  { apr: 9.49, payment: "$490.16", term: "7 Year Term", total: "$41,174" },
  { apr: 10.15, payment: "$401.58", term: "10 Year Term", total: "$48,190" },
];

function RateCard({ autoPayEnabled, isSelected, onSelect, rate }: { autoPayEnabled: boolean; isSelected: boolean; onSelect: () => void; rate: Rate }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const apr = rate.apr - (autoPayEnabled ? 0.25 : 0);

  return (
    <article className={styles.rateCard}>
      <button aria-pressed={isSelected} className={styles.rateSummary} onClick={onSelect} type="button">
        <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`} />
        <strong className={styles.term}>{rate.term.includes("Term") ? rate.term : `${rate.term.replace(/\b\w/g, (letter) => letter.toUpperCase())} Term`}</strong>
        <RateValue value={rate.payment} />
        <RateValue value="$25" />
        <RateValue originalValue={autoPayEnabled ? `${rate.apr.toFixed(2)}%` : undefined} value={`${apr.toFixed(2)}%`} />
      </button>
      <button aria-expanded={detailsOpen} className={styles.detailsButton} onClick={() => setDetailsOpen((open) => !open)} type="button">
        {detailsOpen ? "Hide Details" : "See Details"}
      </button>
      {detailsOpen ? (
        <div className={styles.paymentDetails}>
          <span className={styles.paymentDate}>Expected first payment date after school: <span className={styles.paymentDateValue}>10/2028</span></span>
        </div>
      ) : null}
    </article>
  );
}

function RateValue({ label, originalValue, showLabel, value }: { label?: ReactNode; originalValue?: string; showLabel?: boolean; value: string }) {
  return (
    <span className={styles.rateValue}>
      {showLabel ? <small>{label}</small> : null}
      <strong>{originalValue ? <><span className={styles.originalApr}>{originalValue}</span> / {value}</> : value}</strong>
    </span>
  );
}

export default function Rates() {
  const router = useRouter();
  const [firstName] = useState(() => typeof window === "undefined" ? "Marc" : localStorage.getItem("in-school-loans-user-first-name") || "Marc");
  const [lastName] = useState(() => typeof window === "undefined" ? "Schoonover" : localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  const [paymentType, setPaymentType] = useState("Immediate");
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const paymentTypes = ["Immediate", "Fixed", "Interest Only", "Deferred"];
  const selectedRateDetails = selectedRate
    ? [
        ...fixedRates.map((rate, index) => ({ id: `fixed-${index}`, rate, type: "fixed" })),
        ...variableRates.map((rate, index) => ({ id: `variable-${index}`, rate, type: "variable" })),
      ].find(({ id }) => id === selectedRate)
    : undefined;

  return (
    <div className={styles.page}>
      <TopNav title="Welcome to Education Loan Finance" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <section className={styles.congrats}>
          <h1>Congrats {firstName} {lastName}!</h1>
          <p>Pending final review and verification you are conditionally pre-qualified for the following loan products, respective interest rates, and monthly payment(s) for each loan term.</p>
        </section>
        <div aria-label="Payment type" className={styles.paymentTypes} role="tablist">
          {paymentTypes.map((type) => (
            <button aria-selected={paymentType === type} className={paymentType === type ? styles.activePaymentType : undefined} key={type} onClick={() => setPaymentType(type)} role="tab" type="button">
              {type} <span aria-hidden="true">ⓘ</span>
            </button>
          ))}
        </div>
        <RateSection autoPayEnabled={autoPayEnabled} description="Locked interest rate for the entire loan term" onAutoPayChange={setAutoPayEnabled} rates={fixedRates} selectedRate={selectedRate} setSelectedRate={setSelectedRate} showAutoPayToggle title="Fixed Rates" type="fixed" />
        <RateSection autoPayEnabled={autoPayEnabled} description="Interest rate may change over time based on market conditions" onAutoPayChange={setAutoPayEnabled} rates={variableRates} selectedRate={selectedRate} setSelectedRate={setSelectedRate} title="Variable Rates" type="variable" />
      </main>
      {selectedRateDetails ? (
        <footer className={styles.selectionFooter}>
          <div className={styles.selectionFooterContent}>
            <div className={styles.selectionSummary}>
              <h4 className={styles.selectionTitle}>{`${selectedRateDetails.rate.term.match(/\d+/)?.[0]}-year ${selectedRateDetails.type} selection`}</h4>
              <span aria-hidden="true" className={styles.selectionSeparator}>•</span>
              <h4>{selectedRateDetails.rate.payment}/mo</h4>
              <span aria-hidden="true" className={styles.selectionSeparator}>•</span>
              <h4>{selectedRateDetails.rate.total} total</h4>
            </div>
            <Button onClick={() => router.push("/review-and-sign")} size="base" type="button">Review &amp; Sign</Button>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

function RateSection({ autoPayEnabled, description, onAutoPayChange, rates, selectedRate, setSelectedRate, showAutoPayToggle, title, type }: { autoPayEnabled: boolean; description: string; onAutoPayChange: (enabled: boolean) => void; rates: Rate[]; selectedRate: string | null; setSelectedRate: (id: string | null) => void; showAutoPayToggle?: boolean; title: string; type: string }) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <section className={styles.rateSection}>
      <div className={styles.rateSectionHeader}>
        <div className={styles.rateTitle}>
          <h4>{title}</h4>
          <div className={styles.info}>
            <button aria-expanded={infoOpen} aria-label={`About ${title}`} className={styles.infoButton} onClick={() => setInfoOpen((open) => !open)} type="button">i</button>
            {infoOpen ? <div className={styles.infoBubble} role="tooltip">{description}</div> : null}
          </div>
        </div>
        {showAutoPayToggle ? (
          <label className={styles.autoPay}>
            <span>Include Auto-pay discount</span>
            <input checked={autoPayEnabled} onChange={(event) => onAutoPayChange(event.target.checked)} type="checkbox" />
            <span aria-hidden="true" className={styles.toggle} />
          </label>
        ) : null}
      </div>
      <div className={styles.rateTable}>
        <div className={styles.rateTableHeaders}>
          <span />
          <small className={styles.termHeader}>Term length</small>
          <small>Post-grace<br />monthly payment</small>
          <small>In-school<br />monthly payment</small>
          <small>APR*</small>
        </div>
        <div className={styles.rateList}>
          {rates.map((rate, index) => {
            const id = `${type}-${index}`;
            return <RateCard autoPayEnabled={autoPayEnabled} isSelected={selectedRate === id} key={id} onSelect={() => setSelectedRate(selectedRate === id ? null : id)} rate={rate} />;
          })}
        </div>
      </div>
    </section>
  );
}
