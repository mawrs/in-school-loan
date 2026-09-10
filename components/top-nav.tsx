import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "./button";
import styles from "./top-nav.module.css";

type TopNavProps = {
  action?: ReactNode;
  logoAlt?: string;
  logoSrc?: string;
  title?: string;
};

const defaultLogoSrc = "/company_logo.png";

export function TopNav({
  action = <Button size="base">Log In</Button>,
  logoAlt = "Education Loan Finance",
  logoSrc = defaultLogoSrc,
  title = "Welcome to Education Loan Finance",
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
      {action}
    </header>
  );
}
