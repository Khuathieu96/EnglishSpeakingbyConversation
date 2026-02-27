'use client';

import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';

export function BottomFooter() {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerInner}>
        <p className={styles.footerCopy}>{t('copyright')}</p>
      </div>
    </footer>
  );
}
