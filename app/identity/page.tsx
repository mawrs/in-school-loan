"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

export default function Identity() {
  const router = useRouter();
  const [citizenship, setCitizenship] = useState("citizen");
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <div className={styles.progressBar} aria-label="Step 2 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index < 2 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/co-signer");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={2} />
            <div>
              <h1>Let&apos;s verify your identity</h1>
              <p>Providing your social security number now will NOT affect your credit score. If you choose to move forward and apply for a loan, however, we will request a hard credit pull from one or more consumer reporting agencies, which may affect your credit score.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <div className={styles.identityFields}>
              <FloatingInput autoComplete="off" label="Social Security Number" name="ssn" type="password" />
              <FloatingInput label="Date of Birth" name="dateOfBirth" type="date" />
            </div>
            <fieldset className={styles.citizenship}>
              <legend>Citizenship Status</legend>
              <label className={citizenship === "citizen" ? styles.selected : ""}>
                <input checked={citizenship === "citizen"} name="citizenship" onChange={() => setCitizenship("citizen")} type="radio" />
                U.S Citizen
              </label>
              <label className={citizenship === "resident" ? styles.selected : ""}>
                <input checked={citizenship === "resident"} name="citizenship" onChange={() => setCitizenship("resident")} type="radio" />
                Permanent Resident
              </label>
            </fieldset>
          </div>
          <div className={styles.actions}>
            <BackLink href="/school" />
            <Button size="base" type="submit">Next</Button>
          </div>
          <div className={styles.definitions}>
            <p><strong>U.S. Citizen</strong>Born here or naturalized; holds a U.S. passport; can vote and serve on juries.</p>
            <p><strong>Permanent Resident</strong>Green-card holder; can live and work here indefinitely but can&apos;t vote.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
