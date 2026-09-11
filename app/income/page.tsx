"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AmountSlider } from "@/components/amount-slider";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const employmentStatuses = [
  "Employed-Salaried",
  "Employed-Commission Only",
  "Self-Employed",
  "Retired",
  "Unemployed/Full Time Student",
];

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", maximumFractionDigits: 0, style: "currency" }).format(value);
}

export default function Income() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [income, setIncome] = useState(38000);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
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
          <AmountSlider
            ariaLabel="Estimated annual income"
            formatValue={formatAmount}
            max={300000}
            maxLabel="$300,000+"
            min={0}
            minLabel="$0"
            onChange={setIncome}
            value={income}
          />
          <div className={styles.employment}>
            <span>What&apos;s your employment status?</span>
            <Dropdown label="Employment Status" name="employmentStatus" options={employmentStatuses} placeholder="Please Select" />
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
