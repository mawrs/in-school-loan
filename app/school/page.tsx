"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Combobox } from "@/components/combobox";
import { Dropdown } from "@/components/dropdown";
import { FloatingInput } from "@/components/floating-input";
import { FlowProgress } from "@/components/flow-progress";
import { BackLink } from "@/components/link";
import { Stepper } from "@/components/stepper";
import { TopNav } from "@/components/top-nav";
import { readApplicationDraft, updateApplicationDraft, useStoredUser } from "@/lib/storage";
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

const requestedPeriods = [
  "Fall 2026/Spring 2027",
  "Fall 2026",
  "Spring 2027",
  "Summer 2027",
  "Other",
];

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
  const { fullName } = useStoredUser();
  const [degreeLevel, setDegreeLevel] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [requestedPeriod, setRequestedPeriod] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [academicStartDate, setAcademicStartDate] = useState("");
  const [academicEndDate, setAcademicEndDate] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);
  const [isSearchingSchools, setIsSearchingSchools] = useState(false);

  useEffect(() => {
    const draft = readApplicationDraft();
    setDegreeLevel(draft.degreeLevel);
    setDegreeType(draft.degreeType);
    setRequestedPeriod(draft.requestedPeriod);
    setSchoolName(draft.schoolName);
    setGradeLevel(draft.gradeLevel);
    setGraduationDate(draft.graduationDate);
    setAcademicStartDate(draft.academicStartDate);
    setAcademicEndDate(draft.academicEndDate);
    setEnrollmentStatus(draft.enrollmentStatus);
  }, []);

  useEffect(() => {
    if (schoolName.trim().length < 1) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/schools?q=${encodeURIComponent(schoolName)}`, {
          signal: controller.signal,
        });
        const schools: { label: string }[] = response.ok ? await response.json() : [];
        setSchoolOptions(schools.map((school) => school.label));
        setIsSearchingSchools(false);
      } catch {
        if (!controller.signal.aborted) {
          setSchoolOptions([]);
          setIsSearchingSchools(false);
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
      <TopNav title="In-School Loan" userName={fullName} />
      <FlowProgress />
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
                onValueChange={(value) => {
                  setDegreeLevel(value);
                  setDegreeType("");
                  setGradeLevel("");
                  updateApplicationDraft({ degreeLevel: value, degreeType: "", gradeLevel: "" });
                }}
                options={Object.keys(degreePrograms)}
                placeholder="Select Degree Level"
                value={degreeLevel}
              />
              <Dropdown
                key={degreeLevel}
                label="Type of Degree"
                name="degreeType"
                onValueChange={(value) => {
                  setDegreeType(value);
                  updateApplicationDraft({ degreeType: value });
                }}
                options={degreeLevel ? degreePrograms[degreeLevel as keyof typeof degreePrograms] : []}
                placeholder={degreeLevel ? `Type of ${degreeLevel}` : "Type of Degree"}
                value={degreeType}
              />
            </div>
            <Combobox
              filterOptions={false}
              isLoading={isSearchingSchools}
              label="School Name"
              minimumSearchLength={1}
              name="schoolName"
              onValueChange={(value) => {
                setSchoolName(value);
                updateApplicationDraft({ schoolName: value });
                if (schoolOptions.includes(value)) return;
                setSchoolOptions([]);
                setIsSearchingSchools(value.trim().length >= 1);
              }}
              options={schoolOptions}
              value={schoolName}
            />
            <div className={styles.twoColumns}>
              <Dropdown
                key={degreeLevel}
                label="Grade Level"
                name="gradeLevel"
                onValueChange={(value) => {
                  setGradeLevel(value);
                  updateApplicationDraft({ gradeLevel: value });
                }}
                options={degreeLevel ? gradeLevels[degreeLevel as keyof typeof gradeLevels] : []}
                placeholder="Select Grade Level"
                value={gradeLevel}
              />
              <FloatingInput
                label="Actual/Expected Graduation Date"
                name="graduationDate"
                onChange={(event) => {
                  setGraduationDate(event.target.value);
                  updateApplicationDraft({ graduationDate: event.target.value });
                }}
                type="date"
                value={graduationDate}
              />
            </div>
            <Dropdown
              label="Requested Period"
              name="requestedPeriod"
              onValueChange={(value) => {
                setRequestedPeriod(value);
                updateApplicationDraft({ requestedPeriod: value });
              }}
              options={requestedPeriods}
              placeholder="Select Requested Period"
              value={requestedPeriod}
            />
            {requestedPeriod === "Other" ? (
              <div className={styles.twoColumns}>
                <FloatingInput
                  label="Current Academic Year Start Date"
                  name="academicStartDate"
                  onChange={(event) => {
                    setAcademicStartDate(event.target.value);
                    updateApplicationDraft({ academicStartDate: event.target.value });
                  }}
                  required
                  type="date"
                  value={academicStartDate}
                />
                <FloatingInput
                  label="Current Academic Year End Date"
                  name="academicEndDate"
                  onChange={(event) => {
                    setAcademicEndDate(event.target.value);
                    updateApplicationDraft({ academicEndDate: event.target.value });
                  }}
                  required
                  type="date"
                  value={academicEndDate}
                />
              </div>
            ) : null}
            <div className={styles.enrollmentField}>
              <span>Enrollment Status</span>
              <Dropdown
                label="Enrollment Status"
                name="enrollmentStatus"
                onValueChange={(value) => {
                  setEnrollmentStatus(value);
                  updateApplicationDraft({ enrollmentStatus: value });
                }}
                options={["Full-time", "Half-time", "Less than half-time"]}
                placeholder="Please Select"
                value={enrollmentStatus}
              />
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
