import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./link.module.css";

type LinkProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, className, href, onClick, ...props }: LinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");

  if (onClick) {
    return (
      <button className={classes} onClick={onClick} type="button">
        {children}
      </button>
    );
  }

  return (
    <a className={classes} href={href} {...props}>
      {children}
    </a>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function BackLink({ className, ...props }: Omit<LinkProps, "children">) {
  return (
    <Link className={[styles.backLink, className].filter(Boolean).join(" ")} {...props}>
      <ChevronLeftIcon />
      Back
    </Link>
  );
}
