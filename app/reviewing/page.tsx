"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

export default function Reviewing() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
    const timer = window.setTimeout(() => router.replace("/additional-info-needed"), 2000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <h1>We’re reviewing your information</h1>
        <p>This may take a minute</p>
        <div aria-label="Loading" className={styles.loading}>
          <span /><span />
        </div>
      </main>
    </div>
  );
}
