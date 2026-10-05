"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

type Rate = {
  apr: number;
  inSchool: string;
  payment: string;
  term: string;
  total: string;
};

type PaymentType = "Immediate" | "Fixed" | "Interest Only" | "Deferred";

const paymentTypeDescriptions: Record<PaymentType, string> = {
  Immediate: "Pay principal and interest now.",
  Fixed: "Pay $25 a month while in school.",
  "Interest Only": "Pay interest only while in school.",
  Deferred: "No payments until after school.",
};

const ratesByPaymentType: Record<PaymentType, { fixed: Rate[]; variable: Rate[] }> = {
  Immediate: {
    fixed: [
      { apr: 5.74, inSchool: "$576.36", payment: "$576.36", term: "5 years", total: "$34,581.84" },
      { apr: 6.09, inSchool: "$439.55", payment: "$439.55", term: "7 years", total: "$36,922.38" },
      { apr: 6.49, inSchool: "$340.49", payment: "$340.49", term: "10 years", total: "$40,858.96" },
      { apr: 7.14, inSchool: "$272.00", payment: "$272.00", term: "15 years", total: "$48,960.37" },
    ],
    variable: [
      { apr: 5.34, inSchool: "$570.82", payment: "$570.82", term: "5 Year Term", total: "$34,249.32" },
      { apr: 5.69, inSchool: "$433.81", payment: "$433.81", term: "7 Year Term", total: "$36,440.20" },
      { apr: 6.09, inSchool: "$334.42", payment: "$334.42", term: "10 Year Term", total: "$40,130.28" },
    ],
  },
  Fixed: {
    fixed: [
      { apr: 6.49, inSchool: "$25", payment: "$655.45", term: "5 years", total: "$39,927.03" },
      { apr: 6.84, inSchool: "$25", payment: "$506.65", term: "7 years", total: "$43,158.26" },
      { apr: 7.24, inSchool: "$25", payment: "$399.17", term: "10 years", total: "$48,500.49" },
      { apr: 7.89, inSchool: "$25", payment: "$327.15", term: "15 years", total: "$59,487.70" },
    ],
    variable: [
      { apr: 6.09, inSchool: "$25", payment: "$644.00", term: "5 Year Term", total: "$39,239.76" },
      { apr: 6.44, inSchool: "$25", payment: "$496.09", term: "7 Year Term", total: "$42,271.76" },
      { apr: 6.84, inSchool: "$25", payment: "$389.01", term: "10 Year Term", total: "$47,281.76" },
    ],
  },
  "Interest Only": {
    fixed: [
      { apr: 6.24, inSchool: "$156.00", payment: "$583.34", term: "5 years", total: "$38,744.27" },
      { apr: 6.59, inSchool: "$164.75", payment: "$446.79", term: "7 years", total: "$41,484.48" },
      { apr: 6.99, inSchool: "$174.75", payment: "$348.17", term: "10 years", total: "$45,974.50" },
      { apr: 7.64, inSchool: "$191.00", payment: "$280.50", term: "15 years", total: "$55,073.24" },
    ],
    variable: [
      { apr: 5.84, inSchool: "$146.00", payment: "$577.75", term: "5 Year Term", total: "$38,169.28" },
      { apr: 6.19, inSchool: "$154.75", payment: "$440.99", term: "7 Year Term", total: "$40,757.52" },
      { apr: 6.59, inSchool: "$164.75", payment: "$342.02", term: "10 Year Term", total: "$44,996.32" },
    ],
  },
  Deferred: {
    fixed: [
      { apr: 6.99, inSchool: "$0", payment: "$682.73", term: "5 years", total: "$40,963.66" },
      { apr: 7.34, inSchool: "$0", payment: "$529.93", term: "7 years", total: "$44,514.25" },
      { apr: 7.74, inSchool: "$0", payment: "$419.92", term: "10 years", total: "$50,390.08" },
      { apr: 8.39, inSchool: "$0", payment: "$346.91", term: "15 years", total: "$62,443.59" },
    ],
    variable: [
      { apr: 6.59, inSchool: "$0", payment: "$670.88", term: "5 Year Term", total: "$40,252.84" },
      { apr: 6.94, inSchool: "$0", payment: "$518.98", term: "7 Year Term", total: "$43,594.23" },
      { apr: 7.34, inSchool: "$0", payment: "$409.33", term: "10 Year Term", total: "$49,120.19" },
    ],
  },
};

function RateCard({ autoPayEnabled, isSelected, onSelect, rate }: { autoPayEnabled: boolean; isSelected: boolean; onSelect: () => void; rate: Rate }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const apr = rate.apr - (autoPayEnabled ? 0.25 : 0);

  return (
    <article className={styles.rateCard}>
      <button aria-pressed={isSelected} className={styles.rateSummary} onClick={onSelect} type="button">
        <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`} />
        <strong className={styles.term}>{rate.term.includes("Term") ? rate.term : `${rate.term.replace(/\b\w/g, (letter) => letter.toUpperCase())} Term`}</strong>
        <RateValue value={rate.payment} />
        <RateValue value={rate.inSchool} />
        <RateValue value={`${apr.toFixed(2)}%`} />
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

function RateValue({ value }: { value: string }) {
  return (
    <span className={styles.rateValue}>
      <strong>{value}</strong>
    </span>
  );
}

export default function Rates() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [paymentType, setPaymentType] = useState<PaymentType>("Immediate");
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const paymentTypes: PaymentType[] = ["Immediate", "Fixed", "Interest Only", "Deferred"];
  const { fixed: fixedRates, variable: variableRates } = ratesByPaymentType[paymentType];
  const selectedRateDetails = selectedRate
    ? [
        ...fixedRates.map((rate, index) => ({ id: `fixed-${index}`, rate, type: "fixed" })),
        ...variableRates.map((rate, index) => ({ id: `variable-${index}`, rate, type: "variable" })),
      ].find(({ id }) => id === selectedRate)
    : undefined;

  return (
    <div className={styles.page}>
      <TopNav title="Welcome to Education Loan Finance" userName={fullName} />
      <main className={styles.main}>
        <section className={styles.congrats}>
          <h1>Congrats {fullName}!</h1>
          <p>Pending final review and verification you are conditionally pre-qualified for the following loan products, respective interest rates, and monthly payment(s) for each loan term.</p>
        </section>
        <div aria-label="Payment type" className={styles.paymentTypes} role="tablist">
          {paymentTypes.map((type) => {
            const selected = paymentType === type;
            const descriptionId = `payment-type-${type.toLowerCase().replaceAll(" ", "-")}`;

            return (
              <div className={styles.paymentType} key={type}>
                <button aria-describedby={selected ? descriptionId : undefined} aria-selected={selected} className={selected ? styles.activePaymentType : undefined} onClick={() => { setPaymentType(type); setSelectedRate(null); }} role="tab" type="button">
                  {type}
                </button>
                {selected ? <p id={descriptionId}>{paymentTypeDescriptions[type]}</p> : null}
              </div>
            );
          })}
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
