"use client";

import { useTranslations } from 'next-intl';
import { BottomFooter } from '@/app/dashboard/components/BottomFooter';
import { TopNav } from '@/app/dashboard/components/TopNav';
import styles from './documentary.module.css';

const ASSETS = {
  hero: '/documentary_bg.jpg',
  dictionary: 'https://www.figma.com/api/mcp/asset/673bf066-eeda-4bdd-bc39-45bc42aa3b1a',
};

type LinkItem = {
  label: string;
  href?: string;
  icon?: string;
};

type ResourceItem = {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: string;
};

type WebsiteItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

type TutorialStep = {
  step: number;
  title: string;
  description: string;
};

type CommunityItem = {
  title: string;
  label: string;
  href: string;
  badge: 'youtube' | 'facebook' | 'tiktok';
  iconText: string;
};

export default function DocumentaryPage() {
  const t = useTranslations('documentary');

  const additionalResources = t.raw('additionalResources') as ResourceItem[];
  const websites = t.raw('recommendedWebsites.items') as WebsiteItem[];
  const tutorialSteps = t.raw('dictionary.steps') as TutorialStep[];
  const communityItems = t.raw('community.items') as CommunityItem[];
  const textbookItems = t.raw('rules.materials.textbook') as LinkItem[];
  const videoItems = t.raw('rules.materials.video') as LinkItem[];
  const quizletItems = t.raw('rules.materials.quizlet') as LinkItem[];
  const guideItems = t.raw('rules.materials.guides') as LinkItem[];

  const badgeClassMap: Record<CommunityItem['badge'], string> = {
    youtube: styles.youtubeBadge,
    facebook: styles.facebookBadge,
    tiktok: styles.tiktokBadge,
  };

  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>
              {t('hero.titleLine1')}
              <span>{t('hero.titleLine2')}</span>
            </h1>
            <p>{t('hero.description')}</p>
          </div>

          <div className={styles.heroVisual}>
            <img src={ASSETS.hero} alt='Learning illustration' />
          </div>
          </section>

          <section className={styles.rulesSection}>
          <h2>{t('rules.sectionTitle')}</h2>

          <div className={styles.rulesGrid}>
            <article className={styles.instructionsCard}>
              <div className={styles.cardHeader}>
                <span className='material-symbols-outlined'>description</span>
                <h3>{t('rules.guideTitle')}</h3>
              </div>

              <p>{t('rules.guideParagraph1')}</p>
              <p>{t('rules.guideParagraph2')}</p>
              <ul>
                <li>{t('rules.bullet1')}</li>
                <li>{t('rules.bullet2')}</li>
              </ul>

              <a
                className={styles.secondaryButton}
                href={t('rules.guideCtaHref')}
                target='_blank'
                rel='noreferrer'
              >
                <span className='material-symbols-outlined'>play_circle</span>
                {t('rules.guideCtaLabel')}
              </a>
            </article>

            <div className={styles.materialsColumn}>
              <div className={styles.materialCards}>
                <article className={styles.materialCard}>
                  <h4>{t('rules.materialTitles.textbook')}</h4>
                  {textbookItems.map((item) =>
                    item.href ? (
                      <a key={item.label} href={item.href} target='_blank' rel='noreferrer'>
                        {item.label}
                      </a>
                    ) : (
                      <span key={item.label}>{item.label}</span>
                    ),
                  )}
                </article>

                <article className={styles.materialCard}>
                  <h4>{t('rules.materialTitles.video')}</h4>
                  {videoItems.map((item) => (
                    <a key={item.label} href={item.href} target='_blank' rel='noreferrer'>
                      {item.label}
                    </a>
                  ))}
                </article>

                <article className={styles.materialCard}>
                  <h4>{t('rules.materialTitles.quizlet')}</h4>
                  {quizletItems.map((item) => (
                    <a key={item.label} href={item.href} target='_blank' rel='noreferrer'>
                      {item.label}
                    </a>
                  ))}
                </article>

                <article className={styles.materialCard}>
                  <h4>{t('rules.materialTitles.guide')}</h4>
                  {guideItems.map((item) => (
                    <a key={item.label} href={item.href} target='_blank' rel='noreferrer'>
                      {item.label}
                    </a>
                  ))}
                </article>
              </div>
            </div>
          </div>

          <article className={styles.classRuleBanner}>
            <a
              className={styles.bannerLink}
              href={t('rules.classRuleHref')}
              target='_blank'
              rel='noreferrer'
            >
              {t('rules.classRuleLine')}
            </a>
          </article>
          </section>

          <section className={styles.resourceSection}>
          <div className={styles.sectionHeading}>
            <h2>{t('additionalSection.title')}</h2>
            <p>{t('additionalSection.description')}</p>
          </div>

          <div className={styles.resourceGrid}>
            {additionalResources.map((item) => (
              <article key={item.title} className={styles.resourceCard}>
                <div className={styles.resourceIcon}>
                  <span className='material-symbols-outlined'>{item.icon}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={item.href} target='_blank' rel='noreferrer'>
                  {item.action}
                </a>
              </article>
            ))}
          </div>
          </section>

          <section className={styles.websitesSection}>
          <div className={styles.websitesHeader}>
            <div>
              <h2>{t('recommendedWebsites.title')}</h2>
            </div>
          </div>

          <div className={styles.websiteList}>
            {websites.map((site) => (
              <a
                key={site.title}
                href={site.href}
                target='_blank'
                rel='noreferrer'
                className={styles.websiteItem}
              >
                <div className={styles.websiteIcon}>
                  <span className='material-symbols-outlined'>{site.icon}</span>
                </div>
                <div className={styles.websiteText}>
                  <h3>{site.title}</h3>
                  <p>{site.description}</p>
                </div>
                <span className='material-symbols-outlined'>open_in_new</span>
              </a>
            ))}

            <article className={styles.websiteItem}>
              <div className={styles.websiteIcon}>
                <span className='material-symbols-outlined'>lightbulb</span>
              </div>
              <div className={styles.websiteText}>
                <h3>{t('recommendedWebsites.collinsTitle')}</h3>
                <p>{t('recommendedWebsites.collinsQuery')}</p>
              </div>
              <span className='material-symbols-outlined'>tips_and_updates</span>
            </article>
          </div>
          </section>

          <section className={styles.dictionarySection}>
          <div className={styles.dictionaryBox}>
            <div className={styles.dictionaryText}>
              <span className={styles.tutorialTag}>{t('dictionary.tag')}</span>
              <h2>
                {t('dictionary.titleLine1')}
                <br />
                {t('dictionary.titleLine2')}
              </h2>
              <p>{t('dictionary.description')}</p>

              <ol>
                {tutorialSteps.map((item) => (
                  <li key={item.step}>
                    <span className={styles.stepNumber}>{item.step}</span>
                    <div className={styles.stepBody}>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <a
                className={styles.darkButton}
                href={t('dictionary.buttonHref')}
                target='_blank'
                rel='noreferrer'
              >
                {t('dictionary.buttonLabel')}
              </a>
            </div>

            <div className={styles.dictionaryImageWrap}>
              <img src={ASSETS.dictionary} alt='Dictionary app interface' />
            </div>
          </div>
          </section>

          <section className={styles.communitySection}>
          <div className={styles.sectionHeading}>
            <h2>{t('community.title')}</h2>
            <p>{t('community.description')}</p>
          </div>

          <div className={styles.communityGrid}>
            {communityItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target='_blank'
                rel='noreferrer'
                className={styles.communityCard}
              >
                <div className={`${styles.communityBadge} ${badgeClassMap[item.badge]}`}>
                  {item.iconText}
                </div>
                <h3>{item.title}</h3>
                <p>{item.label}</p>
              </a>
            ))}
          </div>
          </section>
        </div>
      </main>

      <BottomFooter />
    </div>
  );
}
