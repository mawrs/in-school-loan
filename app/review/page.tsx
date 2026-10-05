"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { CurrencyInput } from "@/components/currency-input";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { useAddressAutocomplete } from "@/lib/google-maps";
import { storageKeys, useApplicationDraft, useStoredUser, useStoredValue } from "@/lib/storage";
import styles from "./page.module.css";

const currencyLabels = new Set([
  "Cost of Attendance",
  "Estimated Financial Aid",
  "Loan Amount",
  "Housing Expense (Monthly)",
  "Estimated Annual Income",
]);

function PencilIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="m13.5 6.5 3 3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function fieldName(label: string) {
  return label.toLowerCase().replaceAll(/\W+/g, "-");
}

function ReviewSection({ rows, title }: { rows: { label: string; value: string }[]; title: string }) {
  const [savedRows, setSavedRows] = useState(rows);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [nameDraft, setNameDraft] = useState({ first: "", last: "", middle: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const editsAddress = savedRows.some((row) => row.label === "Permanent Address");

  useAddressAutocomplete(
    addressInputRef,
    ({ city, state, street, zip }) => {
      const formatted = [street, city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
      setDrafts((current) => ({ ...current, "Permanent Address": formatted }));
    },
    isEditing && editsAddress,
  );

  function startEditing() {
    const name = savedRows.find((row) => row.label === "Name")?.value ?? "";
    const parts = name.split(" ").filter(Boolean);
    setNameDraft({
      first: parts[0] ?? "",
      last: parts.length > 1 ? (parts.at(-1) ?? "") : "",
      middle: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
    });
    setDrafts(
      Object.fromEntries(
        savedRows.map((row) => [row.label, currencyLabels.has(row.label) ? row.value.replaceAll("$", "") : row.value]),
      ),
    );
    setIsEditing(true);
  }

  function closeEditor() {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsEditing(false);
      setIsClosing(false);
    }, 180);
  }

  function save() {
    setSavedRows((current) =>
      current.map((row) => {
        if (row.label === "Name") {
          return { ...row, value: [nameDraft.first, nameDraft.middle, nameDraft.last].filter(Boolean).join(" ") };
        }

        const draft = drafts[row.label] ?? "";
        if (!currencyLabels.has(row.label)) return { ...row, value: draft };

        const amount = Number(draft.replaceAll(",", ""));
        return { ...row, value: Number.isFinite(amount) ? `$${amount.toLocaleString("en-US")}` : draft };
      }),
    );
    closeEditor();
  }

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        {isEditing ? (
          <div className={styles.editActions}>
            <Button onClick={closeEditor} size="small" type="button" variant="outline">Cancel</Button>
            <Button onClick={save} size="small" type="button">Save</Button>
          </div>
        ) : (
          <button className={styles.editButton} onClick={startEditing} type="button">
            Edit <PencilIcon />
          </button>
        )}
      </div>
      {isEditing ? (
        <div className={`${styles.editor} ${isClosing ? styles.closing : ""}`}>
          {savedRows.map((row) => {
            if (row.label === "Name") {
              return (
                <div className={styles.nameFields} key={row.label}>
                  <FloatingInput label="First Name" name="firstName" onChange={(event) => setNameDraft((draft) => ({ ...draft, first: event.target.value }))} value={nameDraft.first} />
                  <FloatingInput label="Middle Initial (Optional)" name="middleInitial" onChange={(event) => setNameDraft((draft) => ({ ...draft, middle: event.target.value }))} value={nameDraft.middle} />
                  <FloatingInput label="Last Name" name="lastName" onChange={(event) => setNameDraft((draft) => ({ ...draft, last: event.target.value }))} value={nameDraft.last} />
                </div>
              );
            }

            if (currencyLabels.has(row.label)) {
              return (
                <CurrencyInput
                  key={row.label}
                  label={row.label}
                  name={fieldName(row.label)}
                  onValueChange={(value) => setDrafts((current) => ({ ...current, [row.label]: value }))}
                  value={drafts[row.label] ?? ""}
                />
              );
            }

            return (
              <FloatingInput
                inputRef={row.label === "Permanent Address" ? addressInputRef : undefined}
                key={row.label}
                label={row.label}
                name={fieldName(row.label)}
                onChange={(event) => setDrafts((current) => ({ ...current, [row.label]: event.target.value }))}
                value={drafts[row.label] ?? ""}
              />
            );
          })}
        </div>
      ) : (
        <div className={styles.rows}>
          {savedRows.map((row) => (
            <div className={styles.row} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Review() {
  const router = useRouter();
  const { email, firstName, fullName, lastName } = useStoredUser();
  const cost = `$${useStoredValue(storageKeys.costOfAttendance, "60,000")}`;
  const aid = `$${useStoredValue(storageKeys.financialAid, "35,000")}`;
  const loan = `$${useStoredValue(storageKeys.loanAmount, "25,000")}`;
  const annualIncome = useStoredValue(storageKeys.annualIncome);
  const draft = useApplicationDraft();
  const provided = (value: string) => value || "Not provided";
  const applicantName = [draft.firstName || firstName, draft.middleInitial, draft.lastName || lastName].filter(Boolean).join(" ");
  const coSignerName = [draft.coSignerFirstName, draft.coSignerMiddleInitial, draft.coSignerLastName].filter(Boolean).join(" ");
  const address = [draft.street, draft.apartment, [draft.city, [draft.state, draft.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(", ");
  const sections = [
    {
      title: "Loan info",
      rows: [
        { label: "Cost of Attendance", value: cost },
        { label: "Estimated Financial Aid", value: aid },
        { label: "Loan Amount", value: loan },
      ],
    },
    {
      title: "About you",
      rows: [
        { label: "Name", value: applicantName || fullName },
        { label: "Email", value: email || "Not provided" },
        { label: "Date of Birth", value: provided(draft.dateOfBirth) },
        { label: "Phone Number", value: provided(draft.phone) },
        { label: "Permanent Address", value: provided(address) },
        { label: "Social Security Number (SSN)", value: draft.ssn ? "••• - •• - ••••" : "Not provided" },
        { label: "Citizenship Status", value: draft.citizenship === "resident" ? "Permanent Resident" : draft.citizenship === "citizen" ? "U.S Citizen" : "Not provided" },
      ],
    },
    {
      title: "Living arrangement",
      rows: [
        { label: "Living Arrangement", value: provided(draft.livingArrangement) },
        { label: "Housing Expense (Monthly)", value: draft.housingExpense ? `$${draft.housingExpense}` : "Not provided" },
      ],
    },
    {
      title: "Education",
      rows: [
        { label: "School Name", value: provided(draft.schoolName) },
        { label: "Degree Level", value: provided(draft.degreeLevel) },
        { label: "Type of Degree", value: provided(draft.degreeType) },
        { label: "Grade Level", value: provided(draft.gradeLevel) },
        { label: "Graduation Date", value: provided(draft.graduationDate) },
        { label: "Requested Period", value: provided(draft.requestedPeriod) },
        { label: "Enrollment Status", value: provided(draft.enrollmentStatus) },
      ],
    },
    {
      title: "Financial",
      rows: [
        { label: "Estimated Annual Income", value: annualIncome ? `$${annualIncome}` : "Not provided" },
        { label: "Employment Status", value: provided(draft.employmentStatus) },
        { label: "Co-signer", value: draft.hasCoSigner === "true" ? "Yes" : draft.hasCoSigner === "false" ? "No" : "Not provided" },
        { label: "Co-signer Name", value: provided(coSignerName) },
        { label: "Co-signer Email", value: provided(draft.coSignerEmail) },
        { label: "Co-signer Relationship", value: provided(draft.coSignerRelationship) },
      ],
    },
  ];

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Stepper currentStep={4} />
            <h1>{firstName}, let&apos;s review your information</h1>
          </div>
          <div className={styles.sections} key={`${fullName}-${email}-${cost}-${aid}-${loan}-${annualIncome}-${JSON.stringify(draft)}`}>
            {sections.map((section) => (
              <ReviewSection key={section.title} {...section} />
            ))}
          </div>
          <div className={styles.actions}>
            <BackLink href="/income" />
            <Button onClick={() => router.push("/terms-and-conditions")} size="base">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
