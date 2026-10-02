"use client";

import { useSyncExternalStore } from "react";

export const storageKeys = {
  acknowledgementsAccepted: "in-school-loans-acknowledgements-accepted",
  annualIncome: "in-school-loans-annual-income",
  applicationDraft: "in-school-loans-application-draft",
  addressComplete: "in-school-loans-address-complete",
  applications: "in-school-loans-applications",
  costOfAttendance: "in-school-loans-cost-of-attendance",
  currentApplicationId: "in-school-loans-current-application-id",
  email: "in-school-loans-user-email",
  employmentComplete: "in-school-loans-employment-complete",
  financialAid: "in-school-loans-financial-aid",
  loanAmount: "in-school-loans-loan-amount",
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

const emptyApplicationDraft = {
  academicEndDate: "",
  academicStartDate: "",
  apartment: "",
  citizenship: "",
  city: "",
  coSignerEmail: "",
  coSignerFirstName: "",
  coSignerLastName: "",
  coSignerMiddleInitial: "",
  coSignerRelationship: "",
  dateOfBirth: "",
  degreeLevel: "",
  degreeType: "",
  employmentStatus: "",
  enrollmentStatus: "",
  firstName: "",
  gradeLevel: "",
  graduationDate: "",
  hasCoSigner: "",
  housingExpense: "",
  lastName: "",
  livingArrangement: "",
  middleInitial: "",
  phone: "",
  requestedPeriod: "",
  schoolName: "",
  ssn: "",
  state: "",
  street: "",
  zip: "",
};

export type ApplicationDraft = { [Key in keyof typeof emptyApplicationDraft]: string };

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
    storageKeys.annualIncome,
    storageKeys.applicationDraft,
    storageKeys.addressComplete,
    storageKeys.costOfAttendance,
    storageKeys.currentApplicationId,
    storageKeys.employmentComplete,
    storageKeys.financialAid,
    storageKeys.loanAmount,
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

export function readApplicationDraft(): ApplicationDraft {
  const raw = readStoredValue(storageKeys.applicationDraft);
  if (!raw) return { ...emptyApplicationDraft };

  try {
    return { ...emptyApplicationDraft, ...(JSON.parse(raw) as Partial<ApplicationDraft>) };
  } catch {
    return { ...emptyApplicationDraft };
  }
}

export function updateApplicationDraft(patch: Partial<ApplicationDraft>) {
  setStoredValue(storageKeys.applicationDraft, JSON.stringify({ ...readApplicationDraft(), ...patch }));
}

export function useApplicationDraft() {
  const raw = useStoredValue(storageKeys.applicationDraft, "");
  if (!raw) return { ...emptyApplicationDraft };

  try {
    return { ...emptyApplicationDraft, ...(JSON.parse(raw) as Partial<ApplicationDraft>) };
  } catch {
    return { ...emptyApplicationDraft };
  }
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
