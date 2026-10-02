"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { readApplicationDraft, updateApplicationDraft, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

export default function CoSignerDetails() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    const draft = readApplicationDraft();
    setFirstName(draft.coSignerFirstName);
    setMiddleInitial(draft.coSignerMiddleInitial);
    setLastName(draft.coSignerLastName);
    setEmail(draft.coSignerEmail);
    setRelationship(draft.coSignerRelationship);
  }, []);

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
            <Stepper currentLabel="3 of 4 — Co-signer Info" currentStep={3} />
            <h1>Co-signer information</h1>
          </div>
          <div className={styles.fields}>
            <div className={styles.nameFields}>
              <FloatingInput
                label="First Name"
                name="firstName"
                onChange={(event) => {
                  setFirstName(event.target.value);
                  updateApplicationDraft({ coSignerFirstName: event.target.value });
                }}
                value={firstName}
              />
              <FloatingInput
                label="Middle Initial (Optional)"
                maxLength={1}
                name="middleInitial"
                onChange={(event) => {
                  setMiddleInitial(event.target.value);
                  updateApplicationDraft({ coSignerMiddleInitial: event.target.value });
                }}
                value={middleInitial}
              />
              <FloatingInput
                label="Last Name"
                name="lastName"
                onChange={(event) => {
                  setLastName(event.target.value);
                  updateApplicationDraft({ coSignerLastName: event.target.value });
                }}
                value={lastName}
              />
            </div>
            <FloatingInput
              autoComplete="email"
              label="Email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
                updateApplicationDraft({ coSignerEmail: event.target.value });
              }}
              type="email"
              value={email}
            />
            <Dropdown
              label="Relationship"
              name="relationship"
              onValueChange={(value) => {
                setRelationship(value);
                updateApplicationDraft({ coSignerRelationship: value });
              }}
              options={["Parent", "Spouse", "Relative", "Friend", "Other"]}
              placeholder="Relationship"
              value={relationship}
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
