"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

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
  const { email, firstName, fullName, lastName } = useStoredUser();
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
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
          <div className={styles.fields} key={`${fullName}-${email}`}>
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
