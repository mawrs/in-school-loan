import type { ReactNode } from "react";
import styles from "./badge.module.css";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success";
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
