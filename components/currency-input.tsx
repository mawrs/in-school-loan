"use client";

import type { InputHTMLAttributes } from "react";
import { FloatingInput } from "./floating-input";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> & {
  error?: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

function formatCurrency(value: string) {
  const cleaned = value.replaceAll(/[^\d.]/g, "");
  const [wholeNumber = "", ...decimalParts] = cleaned.split(".");
  const formattedWholeNumber = wholeNumber.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = decimalParts.join("").slice(0, 2);

  return cleaned.includes(".") ? `${formattedWholeNumber}.${decimal}` : formattedWholeNumber;
}

export function CurrencyInput({ error, onValueChange, ...props }: CurrencyInputProps) {
  return (
    <FloatingInput
      inputMode="decimal"
      onChange={(event) => onValueChange(formatCurrency(event.target.value))}
      prefix="$"
      type="text"
      error={error}
      {...props}
    />
  );
}
