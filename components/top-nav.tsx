"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import styles from "./top-nav.module.css";

type TopNavProps = {
  action?: ReactNode;
  logoAlt?: string;
  logoSrc?: string;
  title?: string;
  userName?: string;
  onSupport?: () => void;
};

const defaultLogoSrc = "/company_logo.png";

export function TopNav({
  action,
  logoAlt = "Education Loan Finance",
  logoSrc = defaultLogoSrc,
  title = "Welcome to Education Loan Finance",
  userName,
  onSupport,
}: TopNavProps) {
  return (
    <header className={styles.nav}>
      <div className={styles.brand}>
        <Image
          alt={logoAlt}
          className={styles.logo}
          height={74}
          src={logoSrc}
          unoptimized
          width={111}
        />
        <span className={styles.title}>{title}</span>
      </div>
      {action ?? (userName ? <AccountActions onSupport={onSupport} userName={userName} /> : <Button size="base">Log In</Button>)}
    </header>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function AccountActions({ onSupport, userName }: Pick<TopNavProps, "onSupport" | "userName">) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function signOut() {
    localStorage.removeItem("in-school-loans-user-first-name");
    localStorage.removeItem("in-school-loans-user-last-name");
    localStorage.removeItem("in-school-loans-user-email");
    router.push("/");
  }

  return (
    <div className={styles.accountActions}>
      <Button onClick={onSupport} size="small" variant="outline">Contact support</Button>
      <div className={styles.profileMenu}>
        <button aria-expanded={isOpen} aria-haspopup="menu" className={styles.profileButton} onClick={() => setIsOpen((open) => !open)} type="button">
          {userName} <ChevronDownIcon />
        </button>
        {isOpen ? (
          <div className={styles.profileDropdown} role="menu">
            <button onClick={() => router.push("/dashboard")} role="menuitem" type="button">My Profile</button>
            <button onClick={signOut} role="menuitem" type="button">Sign Out</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
