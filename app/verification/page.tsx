"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { readApplicationDraft, updateApplicationDraft, useStoredUser } from "@/lib/storage";
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
  const { email, firstName: storedFirstName, fullName, lastName: storedLastName } = useStoredUser();
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const draft = readApplicationDraft();
    setFirstName(draft.firstName || storedFirstName);
    setMiddleInitial(draft.middleInitial);
    setLastName(draft.lastName || storedLastName);
    setPhoneNumber(draft.phone);
  }, [storedFirstName, storedLastName]);

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
              <FloatingInput
                label="First Name"
                name="firstName"
                onChange={(event) => {
                  setFirstName(event.target.value);
                  updateApplicationDraft({ firstName: event.target.value });
                }}
                value={firstName}
              />
              <FloatingInput
                label="Middle Initial (Optional)"
                maxLength={1}
                name="middleInitial"
                onChange={(event) => {
                  setMiddleInitial(event.target.value);
                  updateApplicationDraft({ middleInitial: event.target.value });
                }}
                value={middleInitial}
              />
              <FloatingInput
                label="Last Name"
                name="lastName"
                onChange={(event) => {
                  setLastName(event.target.value);
                  updateApplicationDraft({ lastName: event.target.value });
                }}
                value={lastName}
              />
            </div>
            <FloatingInput defaultValue={email} disabled label="Email" name="email" type="email" />
            <FloatingInput
              autoComplete="tel"
              inputMode="tel"
              label="Phone Number"
              name="phone"
              onChange={(event) => {
                const phone = formatPhoneNumber(event.target.value);
                setPhoneNumber(phone);
                updateApplicationDraft({ phone });
              }}
              type="tel"
              value={phoneNumber}
            />
          </div>
          <div className={styles.actions}>
            <BackLink href="/loan-info" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
