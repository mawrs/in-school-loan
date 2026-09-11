"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { TopNav } from "@/components/top-nav";
import { useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

export default function LoanProcessing() {
  const router = useRouter();
  const { fullName } = useStoredUser();

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={fullName} />
      <main className={styles.main}>
        <Image alt="" className={styles.illustration} height={180} priority src="/complete.svg" width={180} />
        <h1>Your loan is being processed!</h1>
        <p className={styles.description}>You will be notified once your loan is reviewed. In the meantime, please keep an eye out for emails coming from us about your loan application.</p>
        <section className={styles.loanDetails}>
          <div><span>Loan Amount</span><strong>$11,976</strong></div>
          <div><span>Term</span><strong>5-Year Fixed</strong></div>
          <div><span>APR</span><strong>5.84%</strong></div>
          <div><span>Est. Monthly Payment</span><strong>$211.84</strong></div>
        </section>
        <div className={styles.actions}>
          <Button size="base" variant="outline">Upload documents</Button>
          <Button onClick={() => router.push("/dashboard")} size="base">Go to dashboard</Button>
        </div>
      </main>
    </div>
  );
}
