'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';
import { dashboardAssets } from '../dashboardData';
import { LanguageToggle } from '@/components/LanguageToggle';

/**
 * Application header — used on functional pages like /conversation/[id].
 * Same visual style as TopNav (landing page header) but:
 *  - Smaller height (56px vs 80px)
 *  - Full-width (no max-width container)
 *  - No "Start Learning" CTA button
 */
export function AppHeader() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isHome = pathname === '/';
  const isScenarios = pathname === '/scenarios';

  return (
    <header className={styles.appHeaderWrap}>
      <div className={styles.appHeaderInner}>
        <div className={styles.brandWrap}>
          <div className={styles.brandIconShell} aria-hidden='true' />
          <span className={styles.appHeaderBrandText}>{t('brand')}</span>
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
        </nav>

        <div className={styles.navActions}>
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
