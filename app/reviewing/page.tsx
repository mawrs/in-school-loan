"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

export default function Reviewing() {
  const router = useRouter();
  const { fullName } = useStoredUser();

  useEffect(() => {
    const timer = window.setTimeout(() => router.replace("/additional-info-needed"), 2000);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
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
