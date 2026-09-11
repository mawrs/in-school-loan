"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { BackLink, Link } from "@/components/link";
import { TopNav } from "@/components/top-nav";
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
  "Please Select",
  "Employed-Salaried",
  "Employed-Commission Only",
  "Self Employed",
  "Retired",
  "Unemployed/Full Time Student",
];

type AddressComponent = { long_name: string; short_name: string; types: string[] };
type Place = { address_components?: AddressComponent[] };
type Autocomplete = { addListener: (name: string, handler: () => void) => void; getPlace: () => Place };
type GoogleMaps = {
  maps: { places: { Autocomplete: new (input: HTMLInputElement, options: object) => Autocomplete } };
};

declare global {
  interface Window {
    google?: GoogleMaps;
  }
}

export default function Income() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");
  const [occupation, setOccupation] = useState("");
  const [previousOccupation, setPreviousOccupation] = useState("");
  const [previousEmploymentStatus, setPreviousEmploymentStatus] = useState("");
  const [years, setYears] = useState("");
  const [hasAdditionalIncome, setHasAdditionalIncome] = useState(false);
  const [additionalIncomeSource, setAdditionalIncomeSource] = useState("");
  const [additionalIncomeAmount, setAdditionalIncomeAmount] = useState("");
  const addressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState({ city: "", state: "", street: "", zip: "" });
  const needsPreviousEmployment = years !== "" && Number(years) < 2;

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  }, []);

  function confirmChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("in-school-loans-employment-complete", "true");
    router.push("/additional-info-needed");
  }

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressRef.current) return;

    const initializeAutocomplete = () => {
      if (!window.google || !addressRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        componentRestrictions: { country: "us" },
        fields: ["address_components"],
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const values = { city: "", state: "", street: "", zip: "" };
        let streetNumber = "";

        for (const component of autocomplete.getPlace().address_components ?? []) {
          if (component.types.includes("street_number")) streetNumber = component.long_name;
          if (component.types.includes("route")) values.street = `${streetNumber} ${component.short_name}`.trim();
          if (component.types.includes("locality")) values.city = component.long_name;
          if (component.types.includes("administrative_area_level_1")) values.state = component.short_name;
          if (component.types.includes("postal_code")) values.zip = component.long_name;
        }

        setAddress(values);
      });
    };

    if (window.google) {
      initializeAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initializeAutocomplete;
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
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
              <section className={styles.companyAddress}>
                <h3>Company address</h3>
                <div className={styles.fieldRow}>
                  <FloatingInput inputRef={addressRef} label="Street Address 1" onChange={(event) => setAddress((current) => ({ ...current, street: event.target.value }))} value={address.street} />
                  <FloatingInput label="Street Address 2 (optional)" />
                </div>
                <div className={styles.addressRow}>
                  <FloatingInput label="Zip Code" onChange={(event) => setAddress((current) => ({ ...current, zip: event.target.value }))} value={address.zip} />
                  <FloatingInput label="City" onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} value={address.city} />
                  <FloatingInput label="State" onChange={(event) => setAddress((current) => ({ ...current, state: event.target.value }))} value={address.state} />
                </div>
              </section>
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
                    <Dropdown label="Employment Status" name="previous-employment-status" onValueChange={setPreviousEmploymentStatus} options={employmentStatuses} placeholder="Please Select" />
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
                  <section className={styles.companyAddress}>
                    <h3>Company address</h3>
                    <div className={styles.fieldRow}>
                      <FloatingInput id="previous-street-address-1" label="Street Address 1" />
                      <FloatingInput id="previous-street-address-2" label="Street Address 2 (optional)" />
                    </div>
                    <div className={styles.addressRow}>
                      <FloatingInput id="previous-zip-code" label="Zip Code" />
                      <FloatingInput id="previous-city" label="City" />
                      <FloatingInput id="previous-state" label="State" />
                    </div>
                  </section>
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
