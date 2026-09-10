"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./floating-input.module.css";

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  trailingElement?: ReactNode;
};

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.1A11.6 11.6 0 0 1 12 5c5.5 0 9.3 5.1 9.5 5.3a2.7 2.7 0 0 1 0 3.4 18 18 0 0 1-3.3 3.3M6.2 6.2A18.7 18.7 0 0 0 2.5 10.3a2.7 2.7 0 0 0 0 3.4S6.5 19 12 19c.9 0 1.8-.2 2.6-.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FloatingInput({
  className,
  id,
  label,
  trailingElement,
  type,
  ...props
}: FloatingInputProps) {
  const inputId = id ?? `input-${label.toLowerCase().replaceAll(/\W+/g, "-")}`;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const adornment = isPassword ? (
    <button
      aria-label={`${isPasswordVisible ? "Hide" : "Show"} ${label}`}
      className={styles.visibilityButton}
      onClick={() => setIsPasswordVisible((visible) => !visible)}
      type="button"
    >
      {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
    </button>
  ) : (
    trailingElement
  );

  return (
    <div className={styles.field}>
      <input
        className={[styles.input, className].filter(Boolean).join(" ")}
        id={inputId}
        placeholder=" "
        type={isPassword && isPasswordVisible ? "text" : type}
        {...props}
      />
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      {adornment ? (
        <span className={styles.trailingElement}>{adornment}</span>
      ) : null}
    </div>
  );
}
