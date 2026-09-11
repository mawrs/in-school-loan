"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { FooterDisclaimer } from "@/components/footer-disclaimer";
import { Link } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import { resetApplicationProgress, useStoredUser } from "@/lib/storage";
import styles from "./page.module.css";

const loanTypes = [
  {
    description: "Borrow what you need while you’re in school.",
    name: "In-School Loan",
    requirements: "In-School Loan Requirements",
  },
  {
    description: "Refinance and save with lower monthly payments.",
    name: "Refinancing",
    requirements: "Refinance Loan Requirements",
  },
  {
    description: "Finance your medical education with flexible repayment options.",
    name: "EdMed Loan",
    requirements: "EdMed Loan Requirements",
  },
];

const pendingApplications = [
  {
    id: "129108",
    primaryAction: "Continue",
    status: "Incomplete",
    type: "Student Loan Refi",
  },
  {
    id: "129102",
    primaryAction: "View Application",
    status: "Under Review",
    type: "Student Loan In-School",
  },
];

const completedApplications = [
  {
    id: "129102",
    status: "Loan Approved",
    type: "Student Loan In-School",
  },
];

function BankIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m3 9 9-5 9 5H3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M5 10v7m5-7v7m4-7v7m5-7v7M3 20h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function ApplicationCard({
  application,
  completed = false,
  onOpen,
}: {
  application: (typeof pendingApplications)[number] | (typeof completedApplications)[number];
  completed?: boolean;
  onOpen: () => void;
}) {
  return (
    <article className={styles.applicationCard}>
      <div className={styles.applicationHeader}>
        <h4>{application.type} (#{application.id})</h4>
        <Badge variant={completed ? "success" : application.status === "Incomplete" ? "warning" : "default"}>
          {application.status}
        </Badge>
      </div>
      <div className={styles.applicationActions}>
        {!completed ? <Button onClick={onOpen} size="small" variant="outline">Add Documents</Button> : null}
        <Button onClick={onOpen} size="small" variant={completed ? "outline" : "primary"}>
          {"primaryAction" in application ? application.primaryAction : "View Application"}
        </Button>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const router = useRouter();
  const { firstName, fullName } = useStoredUser();

  function startApplication() {
    resetApplicationProgress();
    router.push("/loan-info");
  }

  return (
    <div className={styles.page}>
      <TopNav onSupport={() => setIsSupportOpen(true)} userName={fullName} />
      {isSupportOpen ? (
        <div
          className={styles.dialogBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsSupportOpen(false);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="support-title"
            aria-modal="true"
            className={styles.dialog}
            role="dialog"
          >
            <button
              aria-label="Close support dialog"
              className={styles.closeButton}
              onClick={() => setIsSupportOpen(false)}
              type="button"
            >
              ×
            </button>
            <h2 id="support-title">Contact support</h2>
            <p className={styles.supportPhone}>(844) 601-3534</p>
            <p>We only offer phone support for now.</p>
          </section>
        </div>
      ) : null}
      {isRequirementsOpen ? (
        <div
          className={styles.dialogBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsRequirementsOpen(false);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="requirements-title"
            aria-modal="true"
            className={`${styles.dialog} ${styles.requirementsDialog}`}
            role="dialog"
          >
            <h4 id="requirements-title">In-School Loan Requirements</h4>
            <ul className={styles.requirementsList}>
              <li>Minimum loan amount: $1,000</li>
              <li>Must be a U.S. citizen or permanent resident</li>
              <li>Must meet the legal age of majority in your state</li>
              <li>Annual income of you or your co-signer: $35,000 or more</li>
              <li>Debt-to-income ratio that demonstrates you can repay the loan</li>
            </ul>
            <div className={styles.requirementsAction}>
              <Button onClick={() => setIsRequirementsOpen(false)} size="base">
                Close
              </Button>
            </div>
          </section>
        </div>
      ) : null}
      <main className={styles.main}>
        <section className={styles.content} aria-labelledby="dashboard-title">
          <header className={styles.header}>
            <h1 id="dashboard-title">Welcome, {firstName}</h1>
            <p>Here&apos;s an overview of your account. Please select what you would like to do.</p>
          </header>
          <section className={styles.applicationsSection} aria-labelledby="pending-applications-title">
            <h2 id="pending-applications-title">Pending applications</h2>
            <div className={styles.applicationList}>
              {pendingApplications.map((application) => (
                <ApplicationCard
                  application={application}
                  key={`${application.type}-${application.id}-${application.status}`}
                  onOpen={() => router.push("/loan-processing")}
                />
              ))}
            </div>
          </section>
          <section className={styles.applicationsSection} aria-labelledby="completed-applications-title">
            <h2 id="completed-applications-title">Completed applications</h2>
            <div className={styles.applicationList}>
              {completedApplications.map((application) => (
                <ApplicationCard
                  application={application}
                  completed
                  key={`${application.type}-${application.id}-${application.status}`}
                  onOpen={() => router.push("/loan-processing")}
                />
              ))}
            </div>
          </section>
          <section className={styles.loanSection} aria-labelledby="loan-type-title">
            <h4 id="loan-type-title">Select a loan type to get started</h4>
            <div className={styles.loanGrid}>
              {loanTypes.map((loan) => (
                <article className={styles.loanOption} key={loan.name}>
                  <button
                    className={
                      selectedLoan === loan.name
                        ? `${styles.loanCard} ${styles.selectedLoanCard}`
                        : styles.loanCard
                    }
                    aria-pressed={selectedLoan === loan.name}
                    onClick={() => {
                      if (loan.name === "In-School Loan") {
                        setSelectedLoan((current) => (current === loan.name ? null : loan.name));
                      }
                    }}
                    type="button"
                  >
                    <BankIcon />
                    <span>
                      <strong>{loan.name}</strong>
                      <small>{loan.description}</small>
                    </span>
                  </button>
                  <Link
                    href="#"
                    onClick={loan.name === "In-School Loan" ? () => setIsRequirementsOpen(true) : undefined}
                  >
                    {loan.requirements}
                  </Link>
                </article>
              ))}
            </div>
          </section>
          <div className={styles.rateAction}>
            <Button
              disabled={!selectedLoan}
              fullWidth
              onClick={startApplication}
              size="base"
            >
              Get a rate in 2 minutes
            </Button>
            <p>Checking your rate will NOT affect your credit score.</p>
          </div>
        </section>
      </main>
      <FooterDisclaimer />
    </div>
  );
}
