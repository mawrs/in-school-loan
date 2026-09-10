"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", maximumFractionDigits: 0, style: "currency" }).format(value);
}

export default function Income() {
  const router = useRouter();
  const [income, setIncome] = useState(38000);
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );
  const position = (income / 300000) * 100;

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <div className={styles.progressBar} aria-label="Step 3 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index < 3 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
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
          <div className={styles.incomePicker}>
            <output style={{ left: `${position}%` }}>{formatAmount(income)}</output>
            <input aria-label="Estimated annual income" max="300000" min="0" onChange={(event) => setIncome(Number(event.target.value))} type="range" value={income} />
            <div><span>$0</span><span>$300,000+</span></div>
          </div>
          <p className={styles.helper}>Please slide to estimate your refinance amount, or type in the amount manually.</p>
          <div className={styles.employment}>
            <span>What&apos;s your employment status?</span>
            <Dropdown
              label="Employment Status"
              name="employmentStatus"
              options={[
                "Employed -Salaried",
                "Employed-Commission Only",
                "Self-Employed",
                "Retired",
                "Unemployed/Full Time Student",
              ]}
              placeholder="Please Select"
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
