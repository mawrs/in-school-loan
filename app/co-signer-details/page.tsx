"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

export default function CoSignerDetails() {
  const router = useRouter();
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
            router.push("/review");
          }}
        >
          <div className={styles.header}>
            <Stepper currentLabel="3 of 4 — Co-signer Info" currentStep={3} />
            <h1>Co-signer information</h1>
          </div>
          <div className={styles.fields}>
            <div className={styles.nameFields}>
              <FloatingInput label="First Name" name="firstName" />
              <FloatingInput label="Middle Initial (Optional)" maxLength={1} name="middleInitial" />
              <FloatingInput label="Last Name" name="lastName" />
            </div>
            <FloatingInput autoComplete="email" label="Email" name="email" type="email" />
            <Dropdown
              label="Relationship"
              name="relationship"
              options={["Parent", "Spouse", "Relative", "Friend", "Other"]}
              placeholder="Relationship"
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
