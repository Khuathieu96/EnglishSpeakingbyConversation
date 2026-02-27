'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './dashboard/Dashboard.module.css';
import { TopNav } from './dashboard/components/TopNav';
import { HeroSection } from './dashboard/components/HeroSection';
import { JourneySection } from './dashboard/components/JourneySection';
import { StatsSection } from './dashboard/components/StatsSection';
import { BottomFooter } from './dashboard/components/BottomFooter';
import {
  inProgressScenarioItems,
  dashboardAssets,
} from './dashboard/dashboardData';

export default function Home() {
  const t = useTranslations('mobile');
  const mobileCards = inProgressScenarioItems.slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.desktopDashboard}>
        <TopNav />
        <main className={styles.main}>
          <div className={styles.container}>
            <HeroSection />
            <JourneySection />
            <StatsSection />
          </div>
        </main>
        <BottomFooter />
      </div>

      <div className={styles.mobileDashboard}>
        <header className={styles.mobileHeaderBar}>
          <div className={styles.mobileHeaderLeft}>
            <div className={styles.mobileHeaderAvatarWrap}>
              <img
                src={dashboardAssets.avatar}
                alt='Profile'
                className={styles.mobileHeaderAvatar}
              />
              <span
                className={styles.mobileHeaderAvatarStatus}
                aria-hidden='true'
              />
            </div>
            <div className={styles.mobileHeaderIdentity}>
              <h1 className={styles.mobileHeaderTitle}>Alex</h1>
              <p className={styles.mobileHeaderSubtitle}>{t('student')}</p>
            </div>
          </div>

          <div className={styles.mobileHeaderActions}></div>
        </header>

        <main className={styles.mobileMainContent}>
          <section className={styles.mobileIntroSection}>
            <h2>{t('greeting')}</h2>
            <p>{t('readyText')}</p>

            <div className={styles.mobileLevelCard}>
              <div className={styles.mobileLevelIcon}>
                <span className='material-symbols-outlined'>school</span>
              </div>
              <div>
                <p className={styles.mobileLevelLabel}>{t('currentLevel')}</p>
                <p className={styles.mobileLevelValue}>{t('levelValue')}</p>
              </div>
            </div>
          </section>

          <section className={styles.mobileStatsGrid}>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>
                local_fire_department
              </span>
              <strong>15</strong>
              <p>{t('streak')}</p>
            </article>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>schedule</span>
              <strong>42</strong>
              <p>{t('hours')}</p>
            </article>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>chat_bubble</span>
              <strong>128</strong>
              <p>{t('dialogs')}</p>
            </article>
          </section>

          <section className={styles.mobileJourneySection}>
            <div className={styles.mobileJourneyHeader}>
              <h3>{t('continueJourney')}</h3>
            </div>

            <div className={styles.mobileJourneyScroller}>
              {mobileCards.map((item) => (
                <Link
                  key={item.id}
                  href={`/conversation/${item.id}`}
                  className={styles.mobileLessonCard}
                >
                  <div className={styles.mobileLessonImageWrap}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.mobileLessonImage}
                    />
                    <span
                      className={
                        item.badge === 'beginner'
                          ? styles.mobileBadgeBeginner
                          : item.badge === 'intermediate'
                            ? styles.mobileBadgeIntermediate
                            : styles.mobileBadgeAdvanced
                      }
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div className={styles.mobileLessonBody}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>

                    <div className={styles.mobileLessonProgressRow}>
                      <div className={styles.mobileLessonProgressTrack}>
                        <div
                          className={styles.mobileLessonProgressFill}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span>{item.progress}%</span>
                    </div>

                    <div className={styles.mobileLessonAction}>
                      {t('resumeLesson')}
                    </div>
                  </div>
                </Link>
              ))}

              <Link href='/scenarios' className={styles.mobileShowMoreCard}>
                <span className='material-symbols-outlined'>apps</span>
                <strong>{t('showMore')}</strong>
                <p>{t('exploreAll')}</p>
              </Link>
            </div>
          </section>

          <section className={styles.mobileGoalCard}>
            <h3>{t('weeklyGoal')}</h3>
            <p>{t('weeklyGoalText')}</p>
            <div className={styles.mobileGoalValueRow}>
              <strong>16</strong>
              <span>{t('goalUnit')}</span>
            </div>
            <span className={styles.mobileGoalIcon}>emoji_events</span>
          </section>
        </main>

        <nav className={styles.mobileBottomNavBar}>
          <Link className={styles.mobileNavLinkActive} href='/'>
            <span className='material-symbols-outlined'>home</span>
            <span>{t('home')}</span>
          </Link>
          <Link className={styles.mobileNavLink} href='/scenarios'>
            <span className='material-symbols-outlined'>menu_book</span>
            <span>{t('library')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
