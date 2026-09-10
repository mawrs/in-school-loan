"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function ReviewItem({ label, value, href }: { href: string; label: string; value: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [savedValue, setSavedValue] = useState(value);
  const [draftValue, setDraftValue] = useState(value);
  const [nameDraft, setNameDraft] = useState(() => {
    const parts = value.split(" ");
    return { first: parts[0] ?? "", last: parts.at(-1) ?? "", middle: "" };
  });

  function closeEditor() {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsEditing(false);
      setIsClosing(false);
    }, 180);
  }

  function saveEditor() {
    setSavedValue(
      label === "Name"
        ? [nameDraft.first, nameDraft.middle, nameDraft.last].filter(Boolean).join(" ")
        : draftValue,
    );
    closeEditor();
  }

  if (isEditing) {
    return (
      <div className={`${styles.item} ${styles.editingItem} ${isClosing ? styles.closingItem : ""}`}>
        <div className={styles.editHeader}>
          <div><span>{label}</span><strong>{savedValue}</strong></div>
          <div className={styles.editActions}>
            <Button onClick={closeEditor} size="small" type="button" variant="outline">Cancel</Button>
            <Button onClick={saveEditor} size="small" type="button">Save</Button>
          </div>
        </div>
        <div className={styles.editFields}>
          {label === "Name" ? (
            <div className={styles.nameFields}>
              <FloatingInput label="First Name" name="firstName" onChange={(event) => setNameDraft((draft) => ({ ...draft, first: event.target.value }))} value={nameDraft.first} />
              <FloatingInput label="Middle Initial (Optional)" name="middleInitial" onChange={(event) => setNameDraft((draft) => ({ ...draft, middle: event.target.value }))} value={nameDraft.middle} />
              <FloatingInput label="Last Name" name="lastName" onChange={(event) => setNameDraft((draft) => ({ ...draft, last: event.target.value }))} value={nameDraft.last} />
            </div>
          ) : (
            <FloatingInput label={label} name={label.toLowerCase().replaceAll(/\W+/g, "-")} onChange={(event) => setDraftValue(event.target.value)} value={draftValue} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.item}>
      <div><span>{label}</span><strong>{savedValue}</strong></div>
      <button
        className={styles.editButton}
        onClick={() => {
          setDraftValue(savedValue);
          setIsEditing(true);
        }}
        type="button"
      >
        Edit
      </button>
    </div>
  );
}

export default function Review() {
  const [firstName] = useState(() => typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John");
  const [lastName] = useState(() => typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe");
  const [email] = useState(() => typeof window === "undefined" ? "" : localStorage.getItem("in-school-loans-user-email") || "");
  const [cost] = useState(() => typeof window === "undefined" ? "$60,000" : `$${localStorage.getItem("in-school-loans-cost-of-attendance") || "60,000"}`);
  const [aid] = useState(() => typeof window === "undefined" ? "$35,000" : `$${localStorage.getItem("in-school-loans-financial-aid") || "35,000"}`);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <div className={styles.progressBar} aria-label="Step 4 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index < 4 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}><Stepper currentStep={4} /><h1>{firstName}, let&apos;s review your information</h1></div>
          <section className={styles.reviewList}>
            <ReviewItem href="/loan-info" label="Cost of Attendance" value={cost} />
            <ReviewItem href="/loan-info" label="Estimated Financial Aid" value={aid} />
            <ReviewItem href="/loan-eligibility" label="Loan Amount" value="$25,000" />
            <ReviewItem href="/verification" label="Name" value={`${firstName} ${lastName}`} />
            <ReviewItem href="/identity" label="Date of Birth" value="Not provided" />
            <ReviewItem href="/verification" label="Phone Number" value="Not provided" />
            <ReviewItem href="/address" label="Permanent Address" value="Not provided" />
            <ReviewItem href="/address" label="Living Arrangement" value="Not provided" />
            <ReviewItem href="/school" label="Attending School" value="Not provided" />
            <ReviewItem href="/identity" label="Social Security Number (SSN)" value="•••-••-••••" />
            <ReviewItem href="/identity" label="Citizenship Status" value="U.S Citizen" />
            <ReviewItem href="/income" label="Estimated Annual Income" value="$38,000" />
            <ReviewItem href="/income" label="Employment Status" value="Not provided" />
            <ReviewItem href="/co-signer" label="Co-signer" value="Not provided" />
            <ReviewItem href="/co-signer-details" label="Co-signer Name" value="Not provided" />
            <ReviewItem href="/co-signer-details" label="Co-signer Email" value={email || "Not provided"} />
            <ReviewItem href="/co-signer-details" label="Co-signer Relationship" value="Not provided" />
          </section>
          <div className={styles.actions}>
            <BackLink href="/income" />
            <Button size="base">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
