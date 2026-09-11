"use client";

import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { BackLink, Link } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import { emptyAddress, useAddressAutocomplete, type ParsedAddress } from "@/lib/google-maps";
import { setStoredValue, storageKeys, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const occupations = [
  "Accountant",
  "Construction Manager/Architect",
  "Dentist",
  "Doctor/MD/Physician",
  "Engineer",
  "Finance/Banking",
  "IT",
  "Lawyer",
  "Marketing",
  "Medical Technician",
  "Pharmacist",
  "Physical / Occupational Therapist",
  "Physician Assistant",
  "Real Estate",
  "Registered Nurse",
  "Sales",
  "Software Development/IT Developer",
  "Teacher",
  "Veterinarian",
  "Other",
];

const additionalIncomeSources = [
  "Alimony",
  "Bonus",
  "Child Support",
  "Commissions",
  "Other",
  "Overtime",
  "Pension/Retirement",
  "Annuity",
  "Long Term Disability",
  "Second Job",
  "Social Security",
  "Schedule K-1",
  "Unemployment",
  "VA Benefits",
];

const employmentStatuses = [
  "Employed-Salaried",
  "Employed-Commission Only",
  "Self Employed",
  "Retired",
  "Unemployed/Full Time Student",
];

function CompanyAddressFields({
  address,
  idPrefix,
  onChange,
}: {
  address: ParsedAddress;
  idPrefix: string;
  onChange: (address: ParsedAddress) => void;
}) {
  const streetRef = useRef<HTMLInputElement>(null);
  useAddressAutocomplete(streetRef, onChange);

  const update = (field: keyof ParsedAddress) => (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...address, [field]: event.target.value });

  return (
    <section className={styles.companyAddress}>
      <h3>Company address</h3>
      <div className={styles.fieldRow}>
        <FloatingInput id={`${idPrefix}-street-address-1`} inputRef={streetRef} label="Street Address 1" onChange={update("street")} value={address.street} />
        <FloatingInput id={`${idPrefix}-street-address-2`} label="Street Address 2 (optional)" />
      </div>
      <div className={styles.addressRow}>
        <FloatingInput id={`${idPrefix}-zip-code`} label="Zip Code" onChange={update("zip")} value={address.zip} />
        <FloatingInput id={`${idPrefix}-city`} label="City" onChange={update("city")} value={address.city} />
        <FloatingInput id={`${idPrefix}-state`} label="State" onChange={update("state")} value={address.state} />
      </div>
    </section>
  );
}

export default function EmploymentDetails() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const [occupation, setOccupation] = useState("");
  const [previousOccupation, setPreviousOccupation] = useState("");
  const [years, setYears] = useState("");
  const [hasAdditionalIncome, setHasAdditionalIncome] = useState(false);
  const [additionalIncomeSource, setAdditionalIncomeSource] = useState("");
  const [additionalIncomeAmount, setAdditionalIncomeAmount] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [previousAddress, setPreviousAddress] = useState(emptyAddress);
  const needsPreviousEmployment = years !== "" && Number(years) < 2;

  function confirmChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStoredValue(storageKeys.employmentComplete, "true");
    router.push("/additional-info-needed");
  }

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <main className={styles.main}>
        <h1>Tell us a little more about your<br />income source</h1>
        <p className={styles.subtitle}>Please fill in the additional information required for your employment history.</p>
        <section className={styles.summary}>
          <div><span>Estimated Annual Income</span><strong>$38,000</strong></div>
          <div><span>Employment Status</span><strong>Employed</strong></div>
          <div className={styles.addIncomeRow}>
            <Link className={styles.addIncome} onClick={() => setHasAdditionalIncome(true)}><span>+</span>I have another source of income</Link>
          </div>
          {hasAdditionalIncome ? (
            <div className={styles.additionalIncome}>
              <Combobox label="Additional Income Source" name="additional-income-source" onValueChange={setAdditionalIncomeSource} options={additionalIncomeSources} value={additionalIncomeSource} />
              <FloatingInput label="Amount Annually" onChange={(event) => setAdditionalIncomeAmount(event.target.value)} value={additionalIncomeAmount} />
              <button
                aria-label="Remove additional income source"
                className={styles.removeIncome}
                onClick={() => {
                  setHasAdditionalIncome(false);
                  setAdditionalIncomeSource("");
                  setAdditionalIncomeAmount("");
                }}
                type="button"
              >
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m-8 0 1 13h8l1-13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                </svg>
              </button>
            </div>
          ) : null}
          <div className={styles.total}>
            <span>Total Annual Income:</span>
            <strong>$38,000.00</strong>
          </div>
        </section>
        <form className={styles.form} onSubmit={confirmChanges}>
          <details className={styles.employmentSection} open>
            <summary>Current employment</summary>
            <div className={styles.employmentContent}>
              <div className={styles.fieldRow}>
                <Combobox label="Occupation" name="occupation" onValueChange={setOccupation} options={occupations} value={occupation} />
                <FloatingInput label="Company Name" />
              </div>
              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>How long have you worked here? (Years / Months)</span>
                <div className={styles.fieldRow}>
                  <FloatingInput label="Years" min="0" onChange={(event) => setYears(event.target.value)} type="number" value={years} />
                  <FloatingInput label="Months" max="11" min="0" type="number" />
                </div>
              </div>
              <CompanyAddressFields address={address} idPrefix="current" onChange={setAddress} />
            </div>
          </details>
          {needsPreviousEmployment ? (
            <>
              <div aria-hidden="true" className={styles.employmentDivider} />
              <h4 className={styles.previousEmploymentNotice}>We need at least 2 years of employment history. Please provide an additional employer.</h4>
              <details className={styles.employmentSection} open>
                <summary>Previous employment</summary>
                <div className={styles.employmentContent}>
                  <div className={styles.fieldRow}>
                    <FloatingInput id="previous-estimated-annual-income" label="Estimated Annual Income" />
                    <Dropdown label="Employment Status" name="previous-employment-status" options={employmentStatuses} placeholder="Please Select" />
                  </div>
                  <div className={styles.fieldRow}>
                    <Combobox label="Occupation" name="previous-occupation" onValueChange={setPreviousOccupation} options={occupations} value={previousOccupation} />
                    <FloatingInput id="previous-company-name" label="Company Name" />
                  </div>
                  <div className={styles.fieldGroup}>
                    <span className={styles.fieldLabel}>How long have you worked here? (Years / Months)</span>
                    <div className={styles.fieldRow}>
                      <FloatingInput id="previous-years" label="Years" min="0" type="number" />
                      <FloatingInput id="previous-months" label="Months" max="11" min="0" type="number" />
                    </div>
                  </div>
                  <CompanyAddressFields address={previousAddress} idPrefix="previous" onChange={setPreviousAddress} />
                </div>
              </details>
            </>
          ) : null}
          <div className={styles.actions}>
            <BackLink href="/additional-info-needed" />
            <Button size="base" type="submit">Confirm Changes</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
