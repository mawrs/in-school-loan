"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./combobox.module.css";

type ComboboxProps = {
  label: string;
  name: string;
  onValueChange: (value: string) => void;
  options: string[];
  value: string;
};

export function Combobox({ label, name, onValueChange, options, value }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const matches = useMemo(
    () => options.filter((option) => option.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );

  useEffect(() => {
    const closeOptions = (event: MouseEvent) => {
      if (!comboboxRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOptions);
    return () => document.removeEventListener("mousedown", closeOptions);
  }, []);

  return (
    <div className={styles.field} ref={comboboxRef}>
      <input
        aria-autocomplete="list"
        aria-controls={`${name}-options`}
        aria-expanded={isOpen}
        autoComplete="off"
        className={styles.input}
        id={`input-${name}`}
        name={name}
        onChange={(event) => {
          onValueChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder=" "
        role="combobox"
        value={value}
      />
      <label className={styles.label} htmlFor={`input-${name}`}>{label}</label>
      {isOpen ? (
        <div className={styles.menu} id={`${name}-options`} role="listbox">
          {matches.length > 0 ? (
            matches.map((option) => (
              <button
                aria-selected={option === value}
                className={option === value ? styles.selected : undefined}
                key={option}
                onClick={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
                role="option"
                type="button"
              >
                {option}
                {option === value ? <span aria-hidden="true">✓</span> : null}
              </button>
            ))
          ) : value ? (
            <p className={styles.emptyMessage}>No results found for {value}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
