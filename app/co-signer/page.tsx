"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

export default function CoSigner() {
  const router = useRouter();
  const [hasCoSigner, setHasCoSigner] = useState(false);
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <FlowProgress />
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            router.push(hasCoSigner ? "/co-signer-details" : "/income");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={3} />
            <div>
              <h1>Do you plan on having a co-signer?</h1>
              <p>Your co-signer&apos;s income must be above $35,000.</p>
            </div>
          </div>
          <fieldset className={styles.options}>
            <label className={hasCoSigner ? styles.selected : ""}>
              <input checked={hasCoSigner} name="coSigner" onChange={() => setHasCoSigner(true)} type="radio" />
              Yes
            </label>
            <label className={!hasCoSigner ? styles.selected : ""}>
              <input checked={!hasCoSigner} name="coSigner" onChange={() => setHasCoSigner(false)} type="radio" />
              No
            </label>
          </fieldset>
          <div className={styles.actions}>
            <BackLink href="/identity" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
