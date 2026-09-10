"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function formatPhoneNumber(value: string) {
  const digits = value.replaceAll(/\D/g, "").slice(0, 10);

  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Verification() {
  const router = useRouter();
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );
  const [email] = useState(
    () => (typeof window === "undefined" ? "" : localStorage.getItem("in-school-loans-user-email") || ""),
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className={styles.page}>
      <TopNav
        title="In-School Loan"
        userName={`${firstName} ${lastName}`}
      />
      <FlowProgress />
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/address");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={2} />
            <h1>Let&apos;s verify your information</h1>
          </div>
          <div className={styles.fields}>
            <div className={styles.nameFields}>
              <FloatingInput defaultValue={firstName} label="First Name" name="firstName" />
              <FloatingInput label="Middle Initial (Optional)" maxLength={1} name="middleInitial" />
              <FloatingInput defaultValue={lastName} label="Last Name" name="lastName" />
            </div>
            <FloatingInput defaultValue={email} disabled label="Email" name="email" type="email" />
            <FloatingInput
              autoComplete="tel"
              inputMode="tel"
              label="Phone Number"
              name="phone"
              onChange={(event) => setPhoneNumber(formatPhoneNumber(event.target.value))}
              type="tel"
              value={phoneNumber}
            />
          </div>
          <div className={styles.actions}>
            <BackLink href="/loan-eligibility" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
