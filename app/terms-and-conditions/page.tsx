"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { BackLink } from "@/components/link";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const acknowledgements = [
  "Electronic Document and Disclosure Consent Agreement",
  "Communications Policy Consent",
];

export default function TermsAndConditions() {
  const router = useRouter();
  const [firstName] = useState(() => typeof window === "undefined" ? "John" : localStorage.getItem("in-school-loans-user-first-name") || "John");
  const [lastName] = useState(() => typeof window === "undefined" ? "Doe" : localStorage.getItem("in-school-loans-user-last-name") || "Doe");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [activeAgreement, setActiveAgreement] = useState<string | null>(null);
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [hasAcceptedAgreement, setHasAcceptedAgreement] = useState(false);
  const canContinue = accepted.length === acknowledgements.length;
  const isCommunicationsPolicy = activeAgreement === acknowledgements[1];
  const agreementTitle = isCommunicationsPolicy
    ? "Communications Policy and Disclosure Consent Agreement"
    : "Electronic Document and Disclosure Consent Agreement";

  function openAgreement(agreement: string) {
    setActiveAgreement(agreement);
    setHasReadAgreement(agreement === acknowledgements[1]);
    setHasAcceptedAgreement(false);
  }

  function acceptAgreement() {
    if (!activeAgreement) return;

    setAccepted((current) => current.includes(activeAgreement) ? current : [...current, activeAgreement]);
    setActiveAgreement(null);
  }

  function checkRate() {
    localStorage.setItem("in-school-loans-acknowledgements-accepted", "true");
    router.push("/rates");
  }

  return (
    <div className={styles.page}>
      <TopNav title="In-School Loan" userName={`${firstName} ${lastName}`} />
      <main className={styles.main}>
        <div className={styles.content}>
          <Image
            alt=""
            className={styles.illustration}
            height={251}
            src="http://localhost:3845/assets/cf7225af7e2ce4d054b1d2c00305e8134f1a1d6e.png"
            unoptimized
            width={251}
          />
          <h1>Almost there, your rate is next!</h1>
          <section aria-labelledby="acknowledgements-heading" className={styles.acknowledgements}>
            <p id="acknowledgements-heading">
              Before clicking, “Check My Rate”, please take a minute to read the language and authorizations outlined in ELFI’s Credit Consent Agreement and Communication Policy.
            </p>
            <div className={styles.consentList}>
              {acknowledgements.map((acknowledgement) => (
                  <button
                    aria-haspopup="dialog"
                    className={styles.consentItem}
                    key={acknowledgement}
                    onClick={() => openAgreement(acknowledgement)}
                    type="button"
                  >
                    <span>{acknowledgement}</span>
                    <Badge variant={accepted.includes(acknowledgement) ? "success" : "default"}>
                      {accepted.includes(acknowledgement) ? "Complete" : "Incomplete"}
                    </Badge>
                  </button>
              ))}
            </div>
          </section>
          <p className={styles.notice}>Checking your rate will NOT affect your credit score.</p>
          <div className={styles.actions}>
            <BackLink href="/review" />
            <Button disabled={!canContinue} onClick={checkRate} size="base">Check my rate</Button>
          </div>
        </div>
      </main>
      {activeAgreement ? (
        <div className={styles.modalBackdrop} onClick={() => setActiveAgreement(null)} role="presentation">
          <section aria-labelledby="agreement-title" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog">
            <header className={styles.modalHeader}>
              <div className={styles.modalBrand}>
                <Image alt="Education Loan Finance" height={74} src="/company_logo.png" width={111} />
              </div>
              <div>
                <strong id="agreement-title">{agreementTitle}</strong>
                <span>Keep a copy for your records.</span>
              </div>
            </header>
            {!hasReadAgreement ? <div className={styles.scrollHint}>Scroll to the bottom to accept</div> : null}
            <div
              className={styles.agreementContent}
              onScroll={(event) => {
                const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
                if (scrollTop + clientHeight >= scrollHeight - 2) setHasReadAgreement(true);
              }}
            >
              {isCommunicationsPolicy ? (
                <>
                  <p>Subject to state and federal law we may monitor or record phone calls for security reasons, to maintain a record and to ensure that you receive courteous and efficient service. You consent in advance to any such recording. To provide you with the best possible service in our ongoing business relationship for your account we may need to contact you about your account from time to time by telephone, text messaging or email. However, we first obtain your consent to contact you about your account in compliance with applicable consumer protection provisions in the federal Telephone Consumer Protection Act of 1991 (TCPA), CAN-SPAM Act and their related federal regulations and orders issued by the Federal Communications Commission (FCC).</p>
                  <p>Your consent is voluntary and not conditioned on the purchase of any product or service from us. With the above understandings, you authorize us to contact you regarding your account throughout its existence using any telephone numbers or email addresses that you have previously provided to us by virtue of an existing business relationship or that you may subsequently provide to us.</p>
                  <p>This consent is regardless of whether the number we use to contact you is assigned to a landline, a paging service, a cellular wireless service, a specialized mobile radio service, other radio common carrier service or any other service for which you may be charged for the call. You further authorize us to contact you through the use of voice, voice mail and text messaging, including the use of pre-recorded or artificial voice messages and an automated dialing device. If necessary, you may change or remove any of the telephone numbers or email addresses at any time using any reasonable means to notify us.</p>
                </>
              ) : (
                <>
                  <p>You may choose to receive documents electronically instead of in paper form by affirmatively consenting to this Electronic Disclosure and Electronic Signature Consent Agreement (“Agreement”). This Agreement applies to all documents and notices we provide to you in electronic form and includes regulatory disclosures, contracts, change in terms notices, forms, documents, records, notices, and any other information associated with your accounts and applications.</p>
                  <p>This does not include account statements. You have the option to choose delivery methods of your account statements separately.</p>
                  <p>“You” and “Your” refer to the consumer who submits or is submitting an account application. “We,” “us” and “our” refer to SouthEast Bank, including its affiliates.</p>
                  <h2>Access and System Requirements</h2>
                  <p>To view and access electronic documents and disclosures, you must have access to a computer or device that meets the following minimum requirements:</p>
                  <ul>
                    <li>An operating system capable of accessing the internet and downloading HTML, ASPX, or PDF files.</li>
                    <li>A current version of your preferred web browser that supports 128-bit encryption.</li>
                    <li>An active email account.</li>
                    <li>Adobe Acrobat Reader for viewing PDF files.</li>
                    <li>Computer or device storage to retain documents electronically, or a printer to retain paper copies.</li>
                  </ul>
                  <h2>Changes to system requirements</h2>
                  <p>We will notify you if the system requirements change in a way that may prevent you from accessing or viewing your electronic documents.</p>
                  <h2>Requesting Paper Copies</h2>
                  <p>You may request a paper copy of any record provided electronically by contacting us. The current fee at the time of your request may apply.</p>
                  <h2>Withdrawing Your Consent</h2>
                  <p>You may withdraw your consent to electronic delivery at any time. Agreements, disclosures, notices, and signatures previously provided electronically will remain valid and enforceable.</p>
                </>
              )}
            </div>
            <footer className={styles.modalFooter}>
              <label className={styles.acceptance}>
                <input checked={hasAcceptedAgreement} disabled={!hasReadAgreement} onChange={(event) => setHasAcceptedAgreement(event.target.checked)} type="checkbox" />
                <span>By clicking “Accept &amp; Close”, I acknowledge and accept the {agreementTitle}.</span>
              </label>
              <Button disabled={!hasAcceptedAgreement} fullWidth onClick={acceptAgreement} size="base">Accept &amp; Close</Button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
