"use client";

import { useRef, useState } from "react";
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
import { useStoredUser } from "@/lib/storage";
import { states } from "@/lib/states";
import styles from "./page.module.css";

const livingArrangements = ["Own with Mortgage", "Own without Mortgage", "Rent", "Live with Family"];

export default function Address() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const streetAddressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState(emptyAddress);
  const [housingExpense, setHousingExpense] = useState("");

  useAddressAutocomplete(streetAddressRef, setAddress);

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
                  onChange={(event) => setAddress((current) => ({ ...current, street: event.target.value }))}
                  value={address.street}
                />
                <FloatingInput label="Apt #" name="apartment" />
              </div>
              <div className={styles.addressRow}>
                <FloatingInput label="Zip Code" name="zip" onChange={(event) => setAddress((current) => ({ ...current, zip: event.target.value }))} value={address.zip} />
                <Combobox
                  label="State"
                  name="state"
                  onValueChange={(state) => setAddress((current) => ({ ...current, state }))}
                  options={states}
                  value={address.state}
                />
                <FloatingInput label="City" name="city" onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} value={address.city} />
              </div>
            </div>
            <div className={styles.livingFields}>
              <div className={styles.selectField}>
                <span>What is your current living arrangement?</span>
                <Dropdown label="Living Arrangement" name="livingArrangement" options={livingArrangements} placeholder="Please Select" />
              </div>
              <CurrencyInput label="Housing Expense (Monthly)" name="housingExpense" onValueChange={setHousingExpense} value={housingExpense} />
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
