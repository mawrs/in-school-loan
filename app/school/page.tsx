"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const degreePrograms = {
  "Undergraduate Degree": ["Undergraduate"],
  "Master Degree": [
    "MBA (Business Administration)",
    "MSN (Nursing)",
    "OT (Occupational Therapy)",
    "Other Masters",
  ],
  "Doctorate Degree": [
    "DDM (Dental Medicine)",
    "DDS (Dental Surgery)",
    "DMD (Doctor of Medical Dentistry)",
    "DNP (Nursing)",
    "DO (Osteopathic Medicine)",
    "DPM (Podiatric Medicine)",
    "DPT (Physical Therapy)",
    "DVM (Veterinary Medicine)",
    "JD (Law)",
    "MD (Medicine)",
    "OD (Optometry)",
    "Other Doctorate",
    "PharmD (Pharmacy)",
  ],
  "Other Graduate Degree": [
    "DDM (Dental Medicine)",
    "DDS (Dental Surgery)",
    "DMD (Doctor of Medical Dentistry)",
    "DNP (Nursing)",
    "DO (Osteopathic Medicine)",
    "DPM (Podiatric Medicine)",
    "DPT (Physical Therapy)",
    "DVM (Veterinary Medicine)",
    "JD (Law)",
    "MBA (Business Administration)",
    "MD (Medicine)",
    "MSN (Nursing)",
    "OD (Optometry)",
    "OT (Occupational Therapy)",
    "Other Doctorate",
    "Other Masters",
    "PharmD (Pharmacy)",
  ],
};

const gradeLevels = {
  "Undergraduate Degree": [
    "Undergraduate 1st year (Freshman)",
    "Undergraduate 2nd year (Sophomore)",
    "Undergraduate 3rd year (Junior)",
    "Undergraduate 4th year (Senior)",
    "Undergraduate 5th year and Beyond",
  ],
  "Master Degree": [
    "Graduate or Professional 1st year",
    "Graduate or Professional 2nd year",
  ],
  "Doctorate Degree": [
    "Graduate or Professional 1st year",
    "Graduate or Professional 2nd year",
    "Graduate or Professional 3rd year",
    "Graduate or Professional 4th year and Beyond",
  ],
  "Other Graduate Degree": [
    "Graduate or Professional 1st year",
    "Graduate or Professional 2nd year",
    "Graduate or Professional 3rd year",
    "Graduate or Professional 4th year and Beyond",
  ],
};

export default function School() {
  const router = useRouter();
  const [firstName] = useState(
    () => (typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John"),
  );
  const [lastName] = useState(
    () => (typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe"),
  );
  const [degreeLevel, setDegreeLevel] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);

  useEffect(() => {
    if (schoolName.trim().length < 2) {
      setSchoolOptions([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/schools?q=${encodeURIComponent(schoolName)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setSchoolOptions([]);
          return;
        }

        const schools: { label: string }[] = await response.json();
        setSchoolOptions(schools.map((school) => school.label));
      } catch {
        if (!controller.signal.aborted) {
          setSchoolOptions([]);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [schoolName]);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <div className={styles.progressBar} aria-label="Step 2 of 4" role="progressbar">
        {Array.from({ length: 4 }, (_, index) => <span className={index < 2 ? styles.progressComplete : undefined} key={index} />)}
      </div>
      <main className={styles.main}>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/identity");
          }}
        >
          <div className={styles.header}>
            <Stepper currentStep={2} />
            <h1>Which school are you attending?</h1>
          </div>
          <div className={styles.fields}>
            <div className={styles.twoColumns}>
              <Dropdown
                label="Degree Level"
                name="degreeLevel"
                onValueChange={setDegreeLevel}
                options={Object.keys(degreePrograms)}
                placeholder="Select Degree Level"
              />
              <Dropdown
                key={degreeLevel}
                label="Type of Degree"
                name="degreeType"
                options={degreeLevel ? degreePrograms[degreeLevel as keyof typeof degreePrograms] : []}
                placeholder={degreeLevel ? `Type of ${degreeLevel}` : "Type of Degree"}
              />
            </div>
            <Combobox
              label="School Name"
              name="schoolName"
              onValueChange={setSchoolName}
              options={schoolOptions}
              value={schoolName}
            />
            <div className={styles.twoColumns}>
              <Dropdown
                key={degreeLevel}
                label="Grade Level"
                name="gradeLevel"
                options={degreeLevel ? gradeLevels[degreeLevel as keyof typeof gradeLevels] : []}
                placeholder="Select Grade Level"
              />
              <FloatingInput label="Actual/Expected Graduation Date" name="graduationDate" type="date" />
            </div>
            <div className={styles.twoColumns}>
              <FloatingInput label="Current Academic Year Start Date" name="academicStartDate" type="date" />
              <FloatingInput label="Current Academic Year End Date" name="academicEndDate" type="date" />
            </div>
            <div className={styles.enrollmentField}>
              <span>Enrollment Status</span>
              <Dropdown label="Enrollment Status" name="enrollmentStatus" options={["Full-time", "Half-time", "Less than half-time"]} placeholder="Please Select" />
            </div>
          </div>
          <div className={styles.actions}>
            <BackLink href="/address" />
            <Button size="base" type="submit">Next</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
