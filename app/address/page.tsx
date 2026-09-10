"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { FloatingInput } from "@/components/floating-input";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

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
  const addressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState({ city: "", state: "", street: "", zip: "" });
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );

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
        const components = autocomplete.getPlace().address_components ?? [];
        const values = { city: "", state: "", street: "", zip: "" };
        let streetNumber = "";

        for (const component of components) {
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
      <div className={styles.progressBar} aria-label="Step 2 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index < 2 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.header}>
            <Stepper currentStep={2} />
            <div>
              <h1>What is your residential address?</h1>
              <p>Your residential address must be your present, physical address.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <div className={styles.streetRow}>
              <FloatingInput
                inputRef={addressRef}
                label="Street Address"
                name="streetAddress"
                onChange={(event) => setAddress((current) => ({ ...current, street: event.target.value }))}
                value={address.street}
              />
              <FloatingInput label="Apt #" name="apartment" />
            </div>
            <div className={styles.addressRow}>
              <FloatingInput label="Zip Code" name="zip" onChange={(event) => setAddress((current) => ({ ...current, zip: event.target.value }))} value={address.zip} />
              <FloatingInput label="State" name="state" onChange={(event) => setAddress((current) => ({ ...current, state: event.target.value }))} value={address.state} />
              <FloatingInput label="City" name="city" onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} value={address.city} />
            </div>
            <label className={styles.selectField}>
              <span>What is your current living arrangement?</span>
              <select defaultValue="" name="livingArrangement">
                <option disabled value="">Please Select</option>
                <option>Rent</option>
                <option>Own</option>
                <option>Live with family</option>
                <option>Other</option>
              </select>
            </label>
            <FloatingInput label="Housing Expense (Monthly)" name="housingExpense" />
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
