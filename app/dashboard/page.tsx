"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { FooterDisclaimer } from "@/components/footer-disclaimer";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const loanTypes = [
  {
    description: "Borrow what you need while you’re in school.",
    name: "In-School Loan",
    requirements: "In-School Loan Requirements",
  },
  {
    description: "Refinance and save with lower monthly payments.",
    name: "Refinancing",
    requirements: "Refinance Loan Requirements",
  },
  {
    description: "Finance your medical education with flexible repayment options.",
    name: "EdMed Loan",
    requirements: "EdMed Loan Requirements",
  },
];

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m3 9 9-5 9 5H3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M5 10v7m5-7v7m4-7v7m5-7v7M3 20h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export default function Dashboard() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [user] = useState(() => {
    if (typeof window === "undefined") {
      return { firstName: "John", lastName: "" };
    }

    return {
      firstName:
        localStorage.getItem("in-school-loans-user-first-name") ||
        localStorage.getItem("in-school-loans-user-name") ||
        "John",
      lastName: localStorage.getItem("in-school-loans-user-last-name") || "",
    };
  });
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className={styles.page}>
      <TopNav
        action={
          <div className={styles.navActions}>
            <Button onClick={() => setIsSupportOpen(true)} size="small" variant="outline">
              Contact support
            </Button>
            <button className={styles.profileButton} type="button">
              {fullName} <ChevronDownIcon />
            </button>
          </div>
        }
      />
      {isSupportOpen ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <section
            aria-labelledby="support-title"
            aria-modal="true"
            className={styles.dialog}
            role="dialog"
          >
            <button
              aria-label="Close support dialog"
              className={styles.closeButton}
              onClick={() => setIsSupportOpen(false)}
              type="button"
            >
              ×
            </button>
            <h2 id="support-title">Contact support</h2>
            <p className={styles.supportPhone}>(844) 601-3534</p>
            <p>We only offer phone support for now.</p>
          </section>
        </div>
      ) : null}
      <main className={styles.main}>
        <section className={styles.content} aria-labelledby="dashboard-title">
          <header className={styles.header}>
            <h1 id="dashboard-title">Welcome, {user.firstName}</h1>
            <p>Here&apos;s an overview of your account. Please select what you would like to do.</p>
          </header>
          <p className={styles.notice}>You have no applications in progress.</p>
          <section className={styles.loanSection} aria-labelledby="loan-type-title">
            <h2 id="loan-type-title">Select a loan type to get started</h2>
            <div className={styles.loanGrid}>
              {loanTypes.map((loan) => (
                <article className={styles.loanOption} key={loan.name}>
                  <button className={styles.loanCard} type="button">
                    <BankIcon />
                    <span>
                      <strong>{loan.name}</strong>
                      <small>{loan.description}</small>
                    </span>
                  </button>
                  <button className={styles.requirements} type="button">
                    {loan.requirements} <span aria-hidden="true">›</span>
                  </button>
                </article>
              ))}
            </div>
          </section>
          <div className={styles.rateAction}>
            <Button disabled fullWidth size="base">
              Get a rate in 2 minutes
            </Button>
            <p>Checking your rate will NOT affect your credit score.</p>
          </div>
        </section>
      </main>
      <FooterDisclaimer />
    </div>
  );
}
