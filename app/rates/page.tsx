"use client";

import { useState } from "react";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

type Rate = {
  interest: string;
  payment: string;
  term: string;
  total: string;
};

const fixedRates: Rate[] = [
  { interest: "9.20%", payment: "$415.17", term: "5 years", total: "$37,898" },
  { interest: "6.89%", payment: "$451.17", term: "7 years", total: "$37,898" },
  { interest: "7.49%", payment: "$355.95", term: "10 years", total: "$42,714" },
  { interest: "8.24%", payment: "$290.87", term: "15 years", total: "$52,356" },
];

const variableRates: Rate[] = [
  { interest: "8.86%", payment: "$620.71", term: "5 Year Term", total: "$37,243" },
  { interest: "9.49%", payment: "$490.16", term: "7 Year Term", total: "$41,174" },
  { interest: "10.15%", payment: "$401.58", term: "10 Year Term", total: "$48,190" },
];

function RateCard({ isSelected, onSelect, rate }: { isSelected: boolean; onSelect: () => void; rate: Rate }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <article className={styles.rateCard}>
      <button aria-pressed={isSelected} className={styles.rateSummary} onClick={onSelect} type="button">
        <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`} />
        <span className={styles.term}>
          <strong>{rate.term.includes("Term") ? rate.term : `Pay it off in ${rate.term}`}</strong>
          <small>{rate.term.includes("Term") ? "" : `${Number.parseInt(rate.term, 10) * 12} monthly payments`}</small>
        </span>
        <RateValue label="Monthly Payment" value={rate.payment} />
        <RateValue label="Interest Rate" value={rate.interest} />
        <RateValue label="Total Repayments" value={rate.total} />
      </button>
      <button aria-expanded={detailsOpen} className={styles.detailsButton} onClick={() => setDetailsOpen((open) => !open)} type="button">
        {detailsOpen ? "Hide" : "See"} payment details <span aria-hidden="true">{detailsOpen ? "⌃" : "⌄"}</span>
      </button>
      {detailsOpen ? (
        <div className={styles.paymentDetails}>
          <RateValue label="First payment while in school" value="$25.00" />
          <RateValue label="First full payment after school" value={rate.payment} />
        </div>
      ) : null}
    </article>
  );
}

function RateValue({ label, value }: { label: string; value: string }) {
  return (
    <span className={styles.rateValue}>
      <small>{label}</small>
      <strong>{value}</strong>
      <small>{label === "Interest Rate" ? "Stays the same" : label === "Total Repayments" ? "Includes interest" : "Every month after school"}</small>
    </span>
  );
}

export default function Rates() {
  const [firstName] = useState(() => typeof window === "undefined" ? "Marc" : localStorage.getItem("in-school-loans-user-first-name") || "Marc");
  const [lastName] = useState(() => typeof window === "undefined" ? "Schoonover" : localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  const [paymentType, setPaymentType] = useState("Immediate");
  const [selectedRate, setSelectedRate] = useState("fixed-0");
  const paymentTypes = ["Immediate", "Fixed", "Interest Only", "Deferred"];

  return (
    <div className={styles.page}>
      <TopNav title="Welcome to Education Loan Finance" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <section className={styles.congrats}>
          <h1>Congrats {firstName} {lastName}</h1>
          <p>Pending final review and verification you are conditionally pre-qualified for the following loan products, respective interest rates, and monthly payment(s) for each loan term.</p>
        </section>
        <div aria-label="Payment type" className={styles.paymentTypes} role="tablist">
          {paymentTypes.map((type) => (
            <button aria-selected={paymentType === type} className={paymentType === type ? styles.activePaymentType : undefined} key={type} onClick={() => setPaymentType(type)} role="tab" type="button">
              {type} <span aria-hidden="true">ⓘ</span>
            </button>
          ))}
        </div>
        <RateSection description="Locked interest rate for the entire loan term" rates={fixedRates} selectedRate={selectedRate} setSelectedRate={setSelectedRate} title="Fixed Rates" type="fixed" />
        <RateSection description="Interest rate may change over time based on market conditions" rates={variableRates} selectedRate={selectedRate} setSelectedRate={setSelectedRate} title="Variable Rates" type="variable" />
      </main>
    </div>
  );
}

function RateSection({ description, rates, selectedRate, setSelectedRate, title, type }: { description: string; rates: Rate[]; selectedRate: string; setSelectedRate: (id: string) => void; title: string; type: string }) {
  return (
    <section className={styles.rateSection}>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className={styles.rateList}>
        {rates.map((rate, index) => {
          const id = `${type}-${index}`;
          return <RateCard isSelected={selectedRate === id} key={id} onSelect={() => setSelectedRate(id)} rate={rate} />;
        })}
      </div>
    </section>
  );
}
