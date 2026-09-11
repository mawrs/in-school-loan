"use client";

import { useSyncExternalStore } from "react";

export const storageKeys = {
  acknowledgementsAccepted: "in-school-loans-acknowledgements-accepted",
  addressComplete: "in-school-loans-address-complete",
  applications: "in-school-loans-applications",
  costOfAttendance: "in-school-loans-cost-of-attendance",
  currentApplicationId: "in-school-loans-current-application-id",
  email: "in-school-loans-user-email",
  employmentComplete: "in-school-loans-employment-complete",
  financialAid: "in-school-loans-financial-aid",
  firstName: "in-school-loans-user-first-name",
  lastName: "in-school-loans-user-last-name",
} as const;

export type ApplicationStatus = "Incomplete" | "Under Review" | "Loan Approved";

export type StoredApplication = {
  id: string;
  status: ApplicationStatus;
  type: string;
};

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
    storageKeys.currentApplicationId,
    storageKeys.employmentComplete,
    storageKeys.financialAid,
  );
  sessionStorage.removeItem("in-school-loans-progress-route");
}

export function clearStoredApplications() {
  removeStoredValues(storageKeys.applications, storageKeys.currentApplicationId);
}

function parseApplications(raw: string | null): StoredApplication[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readApplications() {
  return parseApplications(readStoredValue(storageKeys.applications));
}

export function startStoredApplication(type = "Student Loan In-School") {
  const application: StoredApplication = {
    id: String(129000 + Math.floor(Math.random() * 9000)),
    status: "Incomplete",
    type,
  };

  setStoredValue(storageKeys.applications, JSON.stringify([application, ...readApplications()]));
  setStoredValue(storageKeys.currentApplicationId, application.id);
  return application;
}

export function markCurrentApplicationUnderReview() {
  const currentId = readStoredValue(storageKeys.currentApplicationId);
  if (!currentId) return;

  setStoredValue(
    storageKeys.applications,
    JSON.stringify(
      readApplications().map((application) =>
        application.id === currentId ? { ...application, status: "Under Review" } : application,
      ),
    ),
  );
}

export function useStoredApplications() {
  return parseApplications(useStoredValue(storageKeys.applications, "[]"));
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
