"use client";

import type { CSSProperties } from "react";
import styles from "./amount-slider.module.css";

type AmountSliderProps = {
  ariaLabel: string;
  formatValue: (value: number) => string;
  max: number;
  maxLabel: string;
  min: number;
  minLabel: string;
  onChange: (value: number) => void;
  value: number;
};

export function AmountSlider({ ariaLabel, formatValue, max, maxLabel, min, minLabel, onChange, value }: AmountSliderProps) {
  const position = max === min ? 100 : ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.slider} style={{ "--slider-position": `${position}%` } as CSSProperties}>
      <output>{formatValue(value)}</output>
      <input
        aria-label={ariaLabel}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <div>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
