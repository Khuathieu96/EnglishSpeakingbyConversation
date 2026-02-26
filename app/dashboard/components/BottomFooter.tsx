import styles from '../PolishDashboard.module.css';
import { polishAssets } from '../polishData';

export function BottomFooter() {
  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerBrandIconWrap}>
            <img
              src={polishAssets.footerLogo}
              alt=''
              aria-hidden='true'
              className={styles.footerBrandIcon}
            />
          </div>
          <span className={styles.footerBrandText}>FluentSpeak</span>
        </div>

        <div className={styles.footerLinks}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
        </div>

        <p className={styles.footerCopy}>
          © 2024 FluentSpeak Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
