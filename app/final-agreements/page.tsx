"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { BackLink } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

function AgreementsIllustration() {
  return (
    <svg aria-hidden="true" className={styles.illustration} fill="none" viewBox="0 0 180 180">
      <path d="m43 35 77-14 20 113-77 14L43 35Z" fill="#fff" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
      <path d="M62 72h45M65 90h42m-38 18h42m-38 18h34" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
      <circle cx="103" cy="58" r="18" stroke="currentColor" strokeWidth="4" />
      <path d="m92 58 9 8 15-18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="m127 55 27 7-12 61-27-7 12-61Z" fill="#fff" stroke="currentColor" strokeLinejoin="round" strokeWidth="4" />
      <path d="m134 72 10 3m-13 10 10 3m-13 10 10 3m-13 10 10 3" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
      <path d="m46 40 77-14" stroke="#20c6c2" strokeLinecap="round" strokeWidth="7" />
    </svg>
  );
}

export default function FinalAgreements() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Marc");
  const [lastName, setLastName] = useState("Schoonover");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCreditReport, setAcceptedCreditReport] = useState(false);
  const [activeAgreement, setActiveAgreement] = useState<"terms" | "credit-report" | null>(null);
  const canSubmit = acceptedTerms && acceptedCreditReport;
  const isTermsAgreement = activeAgreement === "terms";

  useEffect(() => {
    setFirstName(localStorage.getItem("in-school-loans-user-first-name") || "Marc");
    setLastName(localStorage.getItem("in-school-loans-user-last-name") || "Schoonover");
  }, []);

  function acceptAgreement() {
    if (isTermsAgreement) {
      setAcceptedTerms(true);
    } else {
      setAcceptedCreditReport(true);
    }
    setActiveAgreement(null);
  }

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <AgreementsIllustration />
        <h1>You&apos;re nearly finished!</h1>
        <p className={styles.description}>Please review the Terms and Conditions and provide your authorization to obtain the Credit Report so we can continue.</p>
        <section aria-label="Submission Acknowledgement" className={styles.acknowledgements}>
          <button className={styles.agreement} onClick={() => setActiveAgreement("terms")} type="button">
            <span>Terms and Conditions</span>
            <Badge variant={acceptedTerms ? "success" : "default"}>{acceptedTerms ? "Complete" : "Incomplete"}</Badge>
          </button>
          <button className={styles.agreement} onClick={() => setActiveAgreement("credit-report")} type="button">
            <span>Authorization to Obtain Consumer Credit Report</span>
            <Badge variant={acceptedCreditReport ? "success" : "default"}>{acceptedCreditReport ? "Complete" : "Incomplete"}</Badge>
          </button>
        </section>
        <div className={styles.actions}>
          <BackLink href="/additional-info-needed" />
          <Button disabled={!canSubmit} onClick={() => router.push("/submitting")} size="base">Authorize and Submit Application</Button>
        </div>
      </main>
      {activeAgreement ? (
        <div className={styles.modalBackdrop} onClick={() => setActiveAgreement(null)} role="presentation">
          <section aria-labelledby="agreement-title" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog">
            <div className={styles.modalContent}>
              {isTermsAgreement ? (
                <>
                  <strong id="agreement-title">Terms and conditions please read carefully.</strong>
                  <p>All rates are subject to change prior to the issuance of a Student Loan Approval Disclosure. Variable rates are subject to change monthly effective on the first calendar day of each month (a &quot;Change Date&quot;). If a Student Loan Approval Disclosure is provided within thirty (30) days of a Change Date, the Variable rate may change due to changes in the Prime rate, but the Variable rate margin will not change if the terms of the Approval Disclosure are accepted prior to the Change Date.</p>
                  <p>Not all combinations of loan amounts and repayment terms are available. Please see Terms and Conditions for details.</p>
                  <p>You understand and acknowledge that if you are switching from fixed rate federal loan(s) to a variable rate private student loan, that over time your interest rate could rise higher than the original federal loan fixed rate loan(s).</p>
                  <p>Final approval of any loan is subject to receipt and verification of all documentation required by Education Loan Finance, as well as a final determination that the application fully meets all Education Loan Finance underwriting standards.</p>
                </>
              ) : (
                <>
                  <strong id="agreement-title">Authorization to Obtain Consumer Credit Report</strong>
                  <p>In order to help you select the product that best suits your needs, Education Loan Finance (SouthEast Bank) will need to obtain your current credit report. By Acknowledging the checkbox and clicking the Authorize button you agree to allow Education Loan Finance (SouthEast Bank) to request a Credit Report on your behalf.</p>
                  <p>I understand that credit inquiries have the potential to impact my credit scores.</p>
                </>
              )}
            </div>
            <footer className={styles.modalFooter}>
              <Button fullWidth onClick={acceptAgreement} size="base">Accept &amp; Close</Button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
