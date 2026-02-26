import styles from '../PolishDashboard.module.css';
import { polishAssets } from '../polishData';

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
  return (
    <section className={styles.statsSection}>
      <StatCard
        icon={polishAssets.statIcons.streak}
        value='12 Day'
        label='Learning Streak'
        tone='teal'
      />
      <StatCard
        icon={polishAssets.statIcons.hours}
        value='4.5 Hours'
        label='Practice Time'
        tone='indigo'
      />
      <StatCard
        icon={polishAssets.statIcons.completed}
        value='8 Scenarios'
        label='Completed Tasks'
        tone='amber'
      />
    </section>
  );
}
