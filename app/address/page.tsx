"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { CurrencyInput } from "@/components/currency-input";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { emptyAddress, useAddressAutocomplete } from "@/lib/google-maps";
import { readApplicationDraft, updateApplicationDraft, useStoredUser } from "@/lib/storage";
import { states } from "@/lib/states";
import styles from "./page.module.css";

const livingArrangements = ["Own with Mortgage", "Own without Mortgage", "Rent", "Live with Family"];

export default function Address() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState(emptyAddress);
  const [apartment, setApartment] = useState("");
  const [livingArrangement, setLivingArrangement] = useState("");
  const [housingExpense, setHousingExpense] = useState("");

  useEffect(() => {
    const draft = readApplicationDraft();
    setAddress({ city: draft.city, state: draft.state, street: draft.street, zip: draft.zip });
    setApartment(draft.apartment);
    setLivingArrangement(draft.livingArrangement);
    setHousingExpense(draft.housingExpense);
  }, []);

  function updateAddress(next: typeof emptyAddress) {
    setAddress(next);
    updateApplicationDraft({ city: next.city, state: next.state, street: next.street, zip: next.zip });
  }

  useAddressAutocomplete(streetAddressRef, updateAddress);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/school");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={2} />
            <div>
              <h1>What is your residential address?</h1>
              <p>Your residential address must be your present, physical address.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <div className={styles.addressFields}>
              <div className={styles.streetRow}>
                <FloatingInput
                  autoComplete="off"
                  inputRef={streetAddressRef}
                  label="Street Address"
                  name="streetAddress"
                  onChange={(event) => updateAddress({ ...address, street: event.target.value })}
                  value={address.street}
                />
                <FloatingInput
                  label="Apt #"
                  name="apartment"
                  onChange={(event) => {
                    setApartment(event.target.value);
                    updateApplicationDraft({ apartment: event.target.value });
                  }}
                  value={apartment}
                />
              </div>
              <div className={styles.addressRow}>
                <FloatingInput label="Zip Code" name="zip" onChange={(event) => updateAddress({ ...address, zip: event.target.value })} value={address.zip} />
                <Combobox
                  label="State"
                  name="state"
                  onValueChange={(state) => updateAddress({ ...address, state })}
                  options={states}
                  value={address.state}
                />
                <FloatingInput label="City" name="city" onChange={(event) => updateAddress({ ...address, city: event.target.value })} value={address.city} />
              </div>
            </div>
            <div className={styles.livingFields}>
              <div className={styles.selectField}>
                <span>What is your current living arrangement?</span>
                <Dropdown
                  label="Living Arrangement"
                  name="livingArrangement"
                  onValueChange={(value) => {
                    setLivingArrangement(value);
                    updateApplicationDraft({ livingArrangement: value });
                  }}
                  options={livingArrangements}
                  placeholder="Please Select"
                  value={livingArrangement}
                />
              </div>
              <CurrencyInput
                label="Housing Expense (Monthly)"
                name="housingExpense"
                onValueChange={(value) => {
                  setHousingExpense(value);
                  updateApplicationDraft({ housingExpense: value });
                }}
                value={housingExpense}
              />
            </div>
          </div>
          <div className={styles.actions}>
            <BackLink href="/verification" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
