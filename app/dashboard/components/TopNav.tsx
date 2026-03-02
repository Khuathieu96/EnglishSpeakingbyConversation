'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';
import { dashboardAssets } from '../dashboardData';
import { LanguageToggle } from '@/components/LanguageToggle';

export function TopNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isHome = pathname === '/';
  const isScenarios = pathname === '/scenarios';
  const isDocumentary = pathname === '/documentary';
  const isFeedback = pathname === '/feedback';

  return (
    <header className={styles.topNavWrap}>
      <div className={styles.topNavInner}>
        <div className={styles.brandWrap}>
          <div className={styles.brandIconShell} aria-hidden='true' />
          <span className={styles.brandText}>{t('brand')}</span>
        </div>

        <nav className={styles.mainNav}>
          <Link
            href='/'
            className={isHome ? styles.activeLink : styles.navLink}
          >
            {t('home')}
          </Link>
          <Link
            href='/scenarios'
            className={isScenarios ? styles.activeLink : styles.navLink}
          >
            {t('scenarios')}
          </Link>
          <Link
            href='/documentary'
            className={isDocumentary ? styles.activeLink : styles.navLink}
          >
            {t('documentary')}
          </Link>
          <Link
            href='/feedback'
            className={isFeedback ? styles.activeLink : styles.navLink}
          >
            {t('feedback')}
          </Link>
        </nav>

        <div className={styles.navActions}>
          <Link href='/scenarios' className={styles.startButton}>
            {t('startLearning')}
          </Link>
          <LanguageToggle />
          <div className={styles.avatarRing}>
            <img
              src={dashboardAssets.avatar}
              alt='Profile'
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
