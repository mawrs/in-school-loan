import { Link } from "./link";
import styles from "./footer-disclaimer.module.css";

const links = [
  "Privacy Policy",
  "USA PATRIOT Act",
  "Notices",
  "Contact Us",
  "Terms and Conditions",
  "FAQ",
];

export function FooterDisclaimer() {
  return (
    <footer className={styles.footer}>
      <span>12700 Kingston Pike, Knoxville, TN 37934</span>
      <nav aria-label="Legal">
        {links.map((link) => (
          <Link href="#" key={link}>
            {link}
          </Link>
        ))}
      </nav>
      <span>© SouthEast Bank. All rights reserved</span>
    </footer>
  );
}
