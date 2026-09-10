"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";

type DropdownProps = {
  label: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: string[];
  placeholder: string;
};

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

export function Dropdown({ label, name, onValueChange, options, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <input name={name} type="hidden" value={value} />
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {value ? <span className={styles.value}>{value}</span> : null}
        <ChevronDownIcon />
      </button>
      <span className={value ? `${styles.label} ${styles.floatingLabel}` : styles.label}>
        {value ? label : placeholder}
      </span>
      {isOpen ? (
        <div className={styles.menu} role="listbox">
          {options.map((option) => (
            <button
              aria-selected={option === value}
              className={option === value ? styles.selected : undefined}
              key={option}
              onClick={() => {
                setValue(option);
                onValueChange?.(option);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              {option}
              {option === value ? <span aria-hidden="true">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
