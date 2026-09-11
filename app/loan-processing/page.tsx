"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function ProcessingIllustration() {
  return (
    <svg aria-hidden="true" className={styles.illustration} fill="none" viewBox="0 0 180 180">
      <path d="M45 143V31m2 13c30-20 51 2 76-16v57c-25 18-46-4-76 16" fill="#fff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <path d="M48 72c24-19 45 3 75-15" stroke="#20c6c2" strokeLinecap="round" strokeWidth="7" />
      <circle cx="132" cy="130" fill="#20c6c2" r="28" stroke="currentColor" strokeWidth="5" />
      <path d="m120 130 9 10 17-21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
    </svg>
  );
}

export default function LoanProcessing() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  }, []);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <ProcessingIllustration />
        <h1>Your loan is being processed!</h1>
        <p className={styles.description}>You will be notified once your loan is reviewed. In the meantime, please keep an eye out for emails coming from us about your loan application.</p>
        <section className={styles.loanDetails}>
          <div><span>Loan Amount</span><strong>$11,976</strong></div>
          <div><span>Term</span><strong>5-Year Fixed</strong></div>
          <div><span>APR</span><strong>5.84%</strong></div>
          <div><span>Est. Monthly Payment</span><strong>$211.84</strong></div>
        </section>
        <div className={styles.actions}>
          <Button size="base" variant="outline">Upload documents</Button>
          <Button onClick={() => router.push("/dashboard")} size="base">Go to dashboard</Button>
        </div>
      </main>
    </div>
  );
}
