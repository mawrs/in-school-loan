"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { FloatingInput } from "@/components/floating-input";
import { BackLink, Link } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
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

export default function Address() {
  const router = useRouter();
  const previousAddressRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");
  const [years, setYears] = useState("");
  const [hasPreviousAddress, setHasPreviousAddress] = useState(false);
  const [previousAddress, setPreviousAddress] = useState({ city: "", state: "", street: "", zip: "" });
  const needsPreviousAddress = years !== "" && Number(years) < 2;

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !hasPreviousAddress || !previousAddressRef.current) return;

    const initializeAutocomplete = () => {
      if (!window.google || !previousAddressRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(previousAddressRef.current, {
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

        setPreviousAddress(values);
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
  }, [hasPreviousAddress]);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <form className={styles.form} onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem("in-school-loans-address-complete", "true");
          router.push("/additional-info-needed");
        }}>
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
              <FloatingInput error={needsPreviousAddress && !hasPreviousAddress ? "We need at least 2 years of previous addresses. Add another address to continue." : undefined} label="Years" min="0" onChange={(event) => setYears(event.target.value)} type="number" value={years} />
              <FloatingInput label="Months" />
            </div>
          </section>
          {!hasPreviousAddress ? (
            <div className={styles.addAddress}>
              <Link onClick={() => setHasPreviousAddress(true)}><span>+</span>Add another address</Link>
            </div>
          ) : null}
          {hasPreviousAddress ? (
            <section className={styles.previousAddress}>
              <h2>Previous Residential Address</h2>
              <div className={styles.fieldRow}>
                <FloatingInput id="previous-street-address" inputRef={previousAddressRef} label="Street Address" onChange={(event) => setPreviousAddress((current) => ({ ...current, street: event.target.value }))} value={previousAddress.street} />
                <FloatingInput id="previous-apartment" label="Apt# or Mailing Address (optional)" />
              </div>
              <div className={styles.fieldRow}>
                <FloatingInput id="previous-zip-code" label="Zip Code" onChange={(event) => setPreviousAddress((current) => ({ ...current, zip: event.target.value }))} value={previousAddress.zip} />
                <FloatingInput id="previous-city" label="City" onChange={(event) => setPreviousAddress((current) => ({ ...current, city: event.target.value }))} value={previousAddress.city} />
              </div>
              <Combobox label="State" name="previous-state" onValueChange={(state) => setPreviousAddress((current) => ({ ...current, state }))} options={states} value={previousAddress.state} />
              <div className={styles.fieldRow}>
                <FloatingInput id="previous-address-years" label="Years" min="0" type="number" />
                <FloatingInput id="previous-address-months" label="Months" max="11" min="0" type="number" />
              </div>
            </section>
          ) : null}
          <div className={styles.actions}>
            <BackLink href="/additional-info-needed" />
            <Button disabled={needsPreviousAddress && !hasPreviousAddress} size="base" type="submit">Confirm Changes</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
