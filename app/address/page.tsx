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
  const addressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState({ city: "", state: "", street: "", zip: "" });
  const [housingExpense, setHousingExpense] = useState("");
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
          if (component.types.includes("administrative_area_level_1")) values.state = component.long_name;
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
                <Dropdown
                  label="Living Arrangement"
                  name="livingArrangement"
                  options={["Own with Mortgage", "Own without Mortgage", "Rent", "Live with Family"]}
                  placeholder="Please Select"
                />
              </div>
              <CurrencyInput
                label="Monthly Housing Expense"
                name="housingExpense"
                onValueChange={setHousingExpense}
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
