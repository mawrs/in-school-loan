"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { FloatingInput } from "@/components/floating-input";
import { BackLink, Link } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import { emptyAddress, useAddressAutocomplete } from "@/lib/google-maps";
import { setStoredValue, storageKeys, useStoredUser } from "@/lib/storage";
import { states } from "@/lib/states";
import styles from "./page.module.css";

export default function AddressDetails() {
  const router = useRouter();
  const { fullName } = useStoredUser();
  const previousAddressRef = useRef<HTMLInputElement>(null);
  const [years, setYears] = useState("");
  const [hasPreviousAddress, setHasPreviousAddress] = useState(false);
  const [previousAddress, setPreviousAddress] = useState(emptyAddress);
  const needsPreviousAddress = years !== "" && Number(years) < 2;

  useAddressAutocomplete(previousAddressRef, setPreviousAddress, hasPreviousAddress);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setStoredValue(storageKeys.addressComplete, "true");
            router.push("/additional-info-needed");
          }}
        >
          <header>
            <h1>Additional information about your<br />present address</h1>
            <p>Enter every address you have lived at within the last 2 years</p>
          </header>
          <section className={styles.summary}>
            <div className={styles.summaryRow}>
              <div><span>Present Address</span><strong>123 Washington Dr Apt 6<br />San Francisco, CA 94103</strong></div>
              <Link onClick={() => undefined}>Edit</Link>
            </div>
            <div className={styles.summaryRow}>
              <div><span>Living Arrangement</span><strong>Renting</strong></div>
              <Link onClick={() => undefined}>Edit</Link>
            </div>
            <div className={styles.summaryRow}>
              <div><span>Housing Expense (Monthly)</span><strong>$120,000</strong></div>
              <Link onClick={() => undefined}>Edit</Link>
            </div>
          </section>
          <section className={styles.duration}>
            <h2>How long have you lived here? (Years / Months)</h2>
            <div className={styles.fieldRow}>
              <FloatingInput
                error={needsPreviousAddress && !hasPreviousAddress ? "We need at least 2 years of previous addresses. Add another address to continue." : undefined}
                label="Years"
                min="0"
                onChange={(event) => setYears(event.target.value)}
                type="number"
                value={years}
              />
              <FloatingInput label="Months" max="11" min="0" type="number" />
            </div>
          </section>
          {!hasPreviousAddress ? (
            <div className={styles.addAddress}>
              <Link onClick={() => setHasPreviousAddress(true)}><span>+</span>Add another address</Link>
            </div>
          ) : (
            <section className={styles.previousAddress}>
              <h2>Previous Residential Address</h2>
              <div className={styles.fieldRow}>
                <FloatingInput
                  id="previous-street-address"
                  inputRef={previousAddressRef}
                  label="Street Address"
                  onChange={(event) => setPreviousAddress((current) => ({ ...current, street: event.target.value }))}
                  value={previousAddress.street}
                />
                <FloatingInput id="previous-apartment" label="Apt# or Mailing Address (optional)" />
              </div>
              <div className={styles.fieldRow}>
                <FloatingInput id="previous-zip-code" label="Zip Code" onChange={(event) => setPreviousAddress((current) => ({ ...current, zip: event.target.value }))} value={previousAddress.zip} />
                <FloatingInput id="previous-city" label="City" onChange={(event) => setPreviousAddress((current) => ({ ...current, city: event.target.value }))} value={previousAddress.city} />
              </div>
              <Combobox
                label="State"
                name="previous-state"
                onValueChange={(state) => setPreviousAddress((current) => ({ ...current, state }))}
                options={states}
                value={previousAddress.state}
              />
              <div className={styles.fieldRow}>
                <FloatingInput id="previous-address-years" label="Years" min="0" type="number" />
                <FloatingInput id="previous-address-months" label="Months" max="11" min="0" type="number" />
              </div>
            </section>
          )}
          <div className={styles.actions}>
            <BackLink href="/additional-info-needed" />
            <Button disabled={needsPreviousAddress && !hasPreviousAddress} size="base" type="submit">Confirm Changes</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
