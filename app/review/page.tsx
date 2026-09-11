"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { useAddressAutocomplete } from "@/lib/google-maps";
import { storageKeys, useStoredUser, useStoredValue } from "@/lib/storage";
import styles from "./page.module.css";

function ReviewItem({ label, value }: { label: string; value: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [savedValue, setSavedValue] = useState(value);
  const [draftValue, setDraftValue] = useState(value);
  const [nameDraft, setNameDraft] = useState(() => {
    const parts = value.split(" ");
    return { first: parts[0] ?? "", last: parts.at(-1) ?? "", middle: "" };
  });
  const isAddress = label === "Permanent Address";
  const addressInputRef = useRef<HTMLInputElement>(null);

  useAddressAutocomplete(
    addressInputRef,
    ({ city, state, street, zip }) => setDraftValue([street, city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")),
    isAddress && isEditing,
  );

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
            <FloatingInput inputRef={isAddress ? addressInputRef : undefined} label={label} name={label.toLowerCase().replaceAll(/\W+/g, "-")} onChange={(event) => setDraftValue(event.target.value)} value={draftValue} />
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
  const router = useRouter();
  const { email, firstName, fullName } = useStoredUser();
  const cost = `$${useStoredValue(storageKeys.costOfAttendance, "60,000")}`;
  const aid = `$${useStoredValue(storageKeys.financialAid, "35,000")}`;

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}><Stepper currentStep={4} /><h1>{firstName}, let&apos;s review your information</h1></div>
          <section className={styles.reviewList} key={`${fullName}-${email}-${cost}-${aid}`}>
            <ReviewItem label="Cost of Attendance" value={cost} />
            <ReviewItem label="Estimated Financial Aid" value={aid} />
            <ReviewItem label="Loan Amount" value="$25,000" />
            <ReviewItem label="Name" value={fullName} />
            <ReviewItem label="Date of Birth" value="Not provided" />
            <ReviewItem label="Phone Number" value="Not provided" />
            <ReviewItem label="Permanent Address" value="Not provided" />
            <ReviewItem label="Living Arrangement" value="Not provided" />
            <ReviewItem label="Attending School" value="Not provided" />
            <ReviewItem label="Social Security Number (SSN)" value="•••-••-••••" />
            <ReviewItem label="Citizenship Status" value="U.S Citizen" />
            <ReviewItem label="Estimated Annual Income" value="$38,000" />
            <ReviewItem label="Employment Status" value="Not provided" />
            <ReviewItem label="Co-signer" value="Not provided" />
            <ReviewItem label="Co-signer Name" value="Not provided" />
            <ReviewItem label="Co-signer Email" value={email || "Not provided"} />
            <ReviewItem label="Co-signer Relationship" value="Not provided" />
          </section>
          <div className={styles.actions}>
            <BackLink href="/income" />
            <Button onClick={() => router.push("/terms-and-conditions")} size="base">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
