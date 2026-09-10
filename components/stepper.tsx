"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./stepper.module.css";

const steps = [
  "1 of 4 — Loan Info",
  "2 of 4 — About You",
  "3 of 4 — Financial Info",
  "4 of 4 — About You",
];

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

type StepperProps = {
  currentStep: number;
};

export function Stepper({ currentStep }: StepperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!stepperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className={styles.container} ref={stepperRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {steps[currentStep - 1]} <ChevronDownIcon />
      </button>
      {isOpen ? (
        <div className={styles.menu} role="menu">
          {steps.map((step, index) => (
            <button
              aria-current={index + 1 === currentStep ? "step" : undefined}
              className={index + 1 === currentStep ? styles.current : undefined}
              key={step}
              onClick={() => setIsOpen(false)}
              role="menuitem"
              type="button"
            >
              {step}
              {index + 1 === currentStep ? <span aria-hidden="true">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
