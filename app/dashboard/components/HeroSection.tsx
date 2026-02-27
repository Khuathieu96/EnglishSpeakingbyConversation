'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';
import { dashboardAssets } from '../dashboardData';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGradient} />

      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span className={styles.heroBadgeText}>{t('badge')}</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span>{t('titleLine1')}</span>
            <span>{t('titleLine2')}</span>
            <span>
              <em>{t('titleLine3')}</em>
            </span>
            <span>{t('titleLine4')}</span>
          </h1>

          <p className={styles.heroCopy}>{t('description')}</p>

          <div className={styles.heroButtons}>
            <Link href='/scenarios' className={styles.primaryCta}>
              {t('cta')}
            </Link>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImageFrame}>
            <img
              src={dashboardAssets.heroImage}
              alt='Learner practicing English conversation'
              className={styles.heroImage}
            />
            <div className={styles.heroImageOverlay} />
          </div>
        </div>
      </div>
    </section>
  );
}
