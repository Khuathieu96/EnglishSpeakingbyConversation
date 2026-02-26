import { Spline_Sans } from 'next/font/google';
import Link from 'next/link';
import styles from './dashboard/PolishDashboard.module.css';
import { TopNav } from './dashboard/components/TopNav';
import { HeroSection } from './dashboard/components/HeroSection';
import { JourneySection } from './dashboard/components/JourneySection';
import { StatsSection } from './dashboard/components/StatsSection';
import { BottomFooter } from './dashboard/components/BottomFooter';
import { inProgressScenarioItems, polishAssets } from './dashboard/polishData';

const spline = Spline_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function Home() {
  const mobileCards = inProgressScenarioItems.slice(0, 5);

  return (
    <div className={`${styles.page} ${spline.className}`}>
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
                src={polishAssets.avatar}
                alt='Profile'
                className={styles.mobileHeaderAvatar}
              />
              <span className={styles.mobileHeaderAvatarStatus} aria-hidden='true' />
            </div>
            <div className={styles.mobileHeaderIdentity}>
              <h1 className={styles.mobileHeaderTitle}>Alex</h1>
              <p className={styles.mobileHeaderSubtitle}>Student</p>
            </div>
          </div>

          <div className={styles.mobileHeaderActions}>
            <button className={styles.mobileIconBtn} aria-label='Information'>
              <span className='material-symbols-outlined'>info</span>
            </button>
            <button className={styles.mobileIconBtn} aria-label='More options'>
              <span className='material-symbols-outlined'>more_vert</span>
            </button>
          </div>
        </header>

        <main className={styles.mobileMainContent}>
          <section className={styles.mobileIntroSection}>
            <h2>Hi, Alex! 👋</h2>
            <p>Ready to level up your English today?</p>

            <div className={styles.mobileLevelCard}>
              <div className={styles.mobileLevelIcon}>
                <span className='material-symbols-outlined'>school</span>
              </div>
              <div>
                <p className={styles.mobileLevelLabel}>Current Level</p>
                <p className={styles.mobileLevelValue}>B2 Upper Intermediate</p>
              </div>
            </div>
          </section>

          <section className={styles.mobileStatsGrid}>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>local_fire_department</span>
              <strong>15</strong>
              <p>Streak</p>
            </article>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>schedule</span>
              <strong>42</strong>
              <p>Hours</p>
            </article>
            <article className={styles.mobileStatCard}>
              <span className='material-symbols-outlined'>chat_bubble</span>
              <strong>128</strong>
              <p>Dialogs</p>
            </article>
          </section>

          <section className={styles.mobileJourneySection}>
            <div className={styles.mobileJourneyHeader}>
              <h3>Continue Journey</h3>
              <button>View All</button>
            </div>

            <div className={styles.mobileJourneyScroller}>
              {mobileCards.map((item) => (
                <Link
                  key={item.id}
                  href={`/conversation/${item.id}`}
                  className={styles.mobileLessonCard}
                >
                  <div className={styles.mobileLessonImageWrap}>
                    <img src={item.image} alt={item.title} className={styles.mobileLessonImage} />
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

                    <div className={styles.mobileLessonAction}>Resume Lesson</div>
                  </div>
                </Link>
              ))}

              <Link href='/scenarios' className={styles.mobileShowMoreCard}>
                <span className='material-symbols-outlined'>apps</span>
                <strong>Show More</strong>
                <p>Explore all conversations</p>
              </Link>
            </div>
          </section>

          <section className={styles.mobileGoalCard}>
            <h3>Weekly Goal</h3>
            <p>You&apos;re almost there! 4 more hours to hit your target.</p>
            <div className={styles.mobileGoalValueRow}>
              <strong>16</strong>
              <span>/ 20 hrs</span>
            </div>
            <span className={styles.mobileGoalIcon}>emoji_events</span>
          </section>
        </main>

        <nav className={styles.mobileBottomNavBar}>
          <a className={styles.mobileNavLinkActive} href='#'>
            <span className='material-symbols-outlined'>home</span>
            <span>Home</span>
          </a>
          <a className={styles.mobileNavLink} href='#'>
            <span className='material-symbols-outlined'>chat_bubble</span>
            <span>Practice</span>
          </a>
          <a className={styles.mobileNavLink} href='#'>
            <span className='material-symbols-outlined'>menu_book</span>
            <span>Library</span>
          </a>
          <a className={styles.mobileNavLink} href='#'>
            <span className='material-symbols-outlined'>person</span>
            <span>Profile</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
