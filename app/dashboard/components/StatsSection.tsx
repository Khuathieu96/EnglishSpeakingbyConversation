'use client';

import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';
import { dashboardAssets } from '../dashboardData';

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: string;
  value: string;
  label: string;
  tone: 'teal' | 'indigo' | 'amber';
}) {
  return (
    <article className={`${styles.statCard} ${styles[`stat_${tone}`]}`}>
      <div className={`${styles.statIconWrap} ${styles[`statIcon_${tone}`]}`}>
        <img src={icon} alt='' aria-hidden='true' className={styles.statIcon} />
      </div>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </article>
  );
}

export function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section className={styles.statsSection}>
      <StatCard
        icon={dashboardAssets.statIcons.streak}
        value={t('streakValue')}
        label={t('streakLabel')}
        tone='teal'
      />
      <StatCard
        icon={dashboardAssets.statIcons.hours}
        value={t('hoursValue')}
        label={t('hoursLabel')}
        tone='indigo'
      />
      <StatCard
        icon={dashboardAssets.statIcons.completed}
        value={t('completedValue')}
        label={t('completedLabel')}
        tone='amber'
      />
    </section>
  );
}
