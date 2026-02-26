import styles from '../PolishDashboard.module.css';
import { polishAssets } from '../polishData';

export function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGradient} />

      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span className={styles.heroBadgeText}>New AI Scenario Live</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span>Master English</span>
            <span>
              through <em>Real-</em>
            </span>
            <span>
              <em>World</em>
            </span>
            <span>Conversations</span>
          </h1>

          <p className={styles.heroCopy}>
            Stop memorizing rules. Start talking. Practice natural interactions
            in high-stakes environments designed for your success.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryCta}>Get Started Free</button>
            <button className={styles.secondaryCta}>View Demo</button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.heroImageFrame}>
            <img
              src={polishAssets.heroImage}
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
