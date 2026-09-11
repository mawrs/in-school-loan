"use client";

import { useEffect, useRef, type RefObject } from "react";

type AddressComponent = { long_name: string; short_name: string; types: string[] };
type Place = { address_components?: AddressComponent[] };
type Autocomplete = {
  addListener: (name: string, handler: () => void) => void;
  getPlace: () => Place;
};
type PlacesLibrary = {
  Autocomplete: new (input: HTMLInputElement, options: object) => Autocomplete;
};
type GoogleMaps = {
  event: { clearInstanceListeners: (instance: object) => void };
  importLibrary: (name: "places") => Promise<PlacesLibrary>;
};

declare global {
  interface Window {
    google?: { maps: GoogleMaps };
    __inSchoolLoansGoogleMapsReady?: () => void;
  }
}

export type ParsedAddress = { city: string; state: string; street: string; zip: string };

export const emptyAddress: ParsedAddress = { city: "", state: "", street: "", zip: "" };

const scriptId = "google-maps-sdk";
const readyCallback = "__inSchoolLoansGoogleMapsReady" as const;
let mapsPromise: Promise<GoogleMaps | null> | null = null;

// The SDK must only be injected once per page; repeated inserts trigger
// "Element with name ... already defined" errors from Google's custom elements.
// With `loading=async` the API is only usable once Google invokes the callback,
// not on the script's load event.
function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (typeof window.google?.maps.importLibrary === "function") return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.resolve(null);

  mapsPromise = new Promise((resolve) => {
    window[readyCallback] = () => resolve(window.google?.maps ?? null);
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&v=weekly&callback=${readyCallback}`;
    script.async = true;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return mapsPromise;
}

function parsePlace(place: Place): ParsedAddress {
  const address = { ...emptyAddress };
  let streetNumber = "";

  for (const component of place.address_components ?? []) {
    if (component.types.includes("street_number")) streetNumber = component.long_name;
    if (component.types.includes("route")) address.street = `${streetNumber} ${component.short_name}`.trim();
    if (component.types.includes("locality")) address.city = component.long_name;
    if (component.types.includes("administrative_area_level_1")) address.state = component.long_name;
    if (component.types.includes("postal_code")) address.zip = component.long_name;
  }

  return address;
}

export function useAddressAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  onSelect: (address: ParsedAddress) => void,
  enabled = true,
) {
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let attachedInput: HTMLInputElement | null = null;
    let maps: GoogleMaps | null = null;

    loadGoogleMaps()
      .then((loaded) => loaded?.importLibrary("places").then((places) => ({ maps: loaded, places })))
      .then((result) => {
        if (!result || cancelled || !inputRef.current) return;

        maps = result.maps;
        attachedInput = inputRef.current;
        const autocomplete = new result.places.Autocomplete(attachedInput, {
          componentRestrictions: { country: "us" },
          fields: ["address_components"],
          types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
          onSelectRef.current(parsePlace(autocomplete.getPlace()));
        });
      });

    return () => {
      cancelled = true;
      if (maps && attachedInput) maps.event.clearInstanceListeners(attachedInput);
    };
  }, [enabled, inputRef]);
}
