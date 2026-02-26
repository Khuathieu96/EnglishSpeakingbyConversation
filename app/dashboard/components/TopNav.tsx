import Link from 'next/link';
import styles from '../PolishDashboard.module.css';
import { polishAssets } from '../polishData';

export function TopNav() {
  return (
    <header className={styles.topNavWrap}>
      <div className={styles.topNavInner}>
        <div className={styles.brandWrap}>
          <div className={styles.brandIconShell}>
            <img
              src={polishAssets.headerLogo}
              alt=''
              aria-hidden='true'
              className={styles.brandIcon}
            />
          </div>
          <span className={styles.brandText}>FluentSpeak</span>
        </div>

        <nav className={styles.mainNav}>
          <span className={styles.activeLink}>Home</span>
          <span className={styles.navLink}>Scenarios</span>
          <span className={styles.navLink}>Progress</span>
        </nav>

        <div className={styles.navActions}>
          <Link href='/scenarios' className={styles.startButton}>
            Start Learning
          </Link>
          <div className={styles.avatarRing}>
            <img
              src={polishAssets.avatar}
              alt='Profile'
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
