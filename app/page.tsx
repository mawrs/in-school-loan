"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button } from "@/components/button";
import { FooterDisclaimer } from "@/components/footer-disclaimer";
import { FloatingInput } from "@/components/floating-input";
import { TopNav } from "@/components/top-nav";
import styles from "./page.module.css";

const authImage = "/auth_cover.png";

export default function Home() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim() || "John";
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    localStorage.setItem("in-school-loans-user-first-name", firstName);
    localStorage.setItem("in-school-loans-user-last-name", lastName);
    localStorage.setItem("in-school-loans-user-email", email);
    router.push("/dashboard");
  }

  return (
    <div className={styles.page}>
      <TopNav />
      <main className={styles.content}>
        <div className={styles.imagePanel}>
          <Image
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            src={authImage}
            unoptimized
          />
        </div>
        <section className={styles.formPanel} aria-labelledby="auth-title">
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h1 id="auth-title">View your rate in 2 minutes</h1>
              <p>Viewing your rate won&apos;t affect your credit score</p>
            </div>
            <div className={styles.fields}>
              <FloatingInput autoComplete="given-name" label="First Name" name="firstName" required />
              <FloatingInput autoComplete="family-name" label="Last Name" name="lastName" required />
              <FloatingInput autoComplete="email" label="Email" name="email" required type="email" />
              <FloatingInput
                autoComplete="new-password"
                label="Password"
                name="password"
                required
                type="password"
              />
              <FloatingInput
                autoComplete="new-password"
                label="Confirm Password"
                name="confirmPassword"
                required
                type="password"
              />
            </div>
            <div className={styles.actions}>
              <Button fullWidth size="base" type="submit">
                View my rate
              </Button>
              <p className={styles.loginPrompt}>
                Already have an account? <button type="button">Log in</button>
              </p>
            </div>
          </form>
        </section>
      </main>
      <FooterDisclaimer />
    </div>
  );
}
