"use client";

import { useSyncExternalStore } from "react";

export const storageKeys = {
  acknowledgementsAccepted: "in-school-loans-acknowledgements-accepted",
  addressComplete: "in-school-loans-address-complete",
  costOfAttendance: "in-school-loans-cost-of-attendance",
  email: "in-school-loans-user-email",
  employmentComplete: "in-school-loans-employment-complete",
  financialAid: "in-school-loans-financial-aid",
  firstName: "in-school-loans-user-first-name",
  lastName: "in-school-loans-user-last-name",
} as const;

type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];

const changeEvent = "in-school-loans-storage";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function readStoredValue(key: StorageKey) {
  return typeof window === "undefined" ? null : localStorage.getItem(key);
}

export function setStoredValue(key: StorageKey, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(changeEvent));
}

export function removeStoredValues(...keys: StorageKey[]) {
  for (const key of keys) localStorage.removeItem(key);
  window.dispatchEvent(new Event(changeEvent));
}

export function resetApplicationProgress() {
  removeStoredValues(
    storageKeys.acknowledgementsAccepted,
    storageKeys.addressComplete,
    storageKeys.costOfAttendance,
    storageKeys.employmentComplete,
    storageKeys.financialAid,
  );
  sessionStorage.removeItem("in-school-loans-progress-route");
}

export function useStoredValue(key: StorageKey, fallback = "") {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) || fallback,
    () => fallback,
  );
}

export function useStoredUser() {
  const firstName = useStoredValue(storageKeys.firstName, "John");
  const lastName = useStoredValue(storageKeys.lastName, "Doe");
  const email = useStoredValue(storageKeys.email);

  return { email, firstName, fullName: `${firstName} ${lastName}`, lastName };
}
