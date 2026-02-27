'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { conversations } from '@/data/conversations';
import { TopNav } from '@/app/dashboard/components/TopNav';
import { BottomFooter } from '@/app/dashboard/components/BottomFooter';
import styles from './scenarios.module.css';

const difficultyClass: Record<
  'beginner' | 'intermediate' | 'advanced',
  string
> = {
  beginner: styles.badgeBeginner,
  intermediate: styles.badgeIntermediate,
  advanced: styles.badgeAdvanced,
};

const stats_keys = [
  { labelKey: 'currentStreak', value: '12 Days', delta: '' },
  { labelKey: 'totalLearningTime', value: '24h 15m', delta: '+1.6h' },
  { labelKey: 'scenariosCompleted', value: '48', delta: '+5' },
  { labelKey: 'averageAccuracy', value: '92%', delta: '+1%' },
] as const;

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function ScenariosPage() {
  const t = useTranslations('scenarios');
  const tJourney = useTranslations('journey');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>('all');
  const [selectedTopicCategory, setSelectedTopicCategory] =
    useState<string>('all');
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const difficultyRef = useRef<HTMLDivElement | null>(null);
  const topicRef = useRef<HTMLDivElement | null>(null);

  const cards = conversations.map((conversation) => {
    const objectives = conversation.lines
      .filter((line) => line.speaker === 'user' && line.hint)
      .slice(0, 2)
      .map((line) => line.hint as string);

    return {
      id: conversation.id,
      title: conversation.title,
      difficulty: conversation.difficulty,
      image: conversation.thumbnail,
      description: conversation.description,
      estimatedTime: conversation.estimatedTime,
      objectives:
        objectives.length > 0
          ? objectives
          : [
              t('practiceVocabulary', {
                category: conversation.category.toLowerCase(),
              }),
              t('buildFluency'),
            ],
      category: conversation.category,
    };
  });

  const categories = useMemo(
    () => [
      'all',
      ...new Set(conversations.map((conversation) => conversation.category)),
    ],
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (difficultyRef.current && !difficultyRef.current.contains(target)) {
        setIsDifficultyOpen(false);
      }

      if (topicRef.current && !topicRef.current.contains(target)) {
        setIsTopicOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesDifficulty =
        selectedDifficulty === 'all'
          ? true
          : card.difficulty === selectedDifficulty;

      const matchesTopicCategory =
        selectedTopicCategory === 'all'
          ? true
          : card.category.toLowerCase() === selectedTopicCategory.toLowerCase();

      return matchesDifficulty && matchesTopicCategory;
    });
  }, [cards, selectedDifficulty, selectedTopicCategory]);

  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.main}>
        <section className={styles.statsGrid}>
          {stats_keys.map((stat) => (
            <article key={stat.labelKey} className={styles.statCard}>
              <div className={styles.statLabel}>{t(stat.labelKey)}</div>
              <div className={styles.statValueRow}>
                <strong>{stat.value}</strong>
                {stat.delta ? <span>{stat.delta}</span> : null}
              </div>
            </article>
          ))}
        </section>

        <section className={styles.librarySection}>
          <div className={styles.libraryHeader}>
            <div>
              <h1>{t('libraryTitle')}</h1>
              <p>{t('librarySubtitle')}</p>
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterSelectWrap} ref={difficultyRef}>
                <button
                  className={styles.filterSelect}
                  onClick={() => {
                    setIsDifficultyOpen((current) => !current);
                    setIsTopicOpen(false);
                  }}
                >
                  <span className='material-symbols-outlined'>equalizer</span>
                  {tJourney(
                    selectedDifficulty === 'all'
                      ? 'allLevels'
                      : selectedDifficulty === 'beginner'
                        ? 'beginner'
                        : selectedDifficulty === 'intermediate'
                          ? 'intermediate'
                          : 'advanced',
                  )}
                  <span className='material-symbols-outlined'>expand_more</span>
                </button>
                {isDifficultyOpen ? (
                  <div className={styles.filterMenu}>
                    {(
                      [
                        'all',
                        'beginner',
                        'intermediate',
                        'advanced',
                      ] as DifficultyFilter[]
                    ).map((level) => (
                      <button
                        key={level}
                        className={
                          selectedDifficulty === level
                            ? styles.filterMenuActive
                            : ''
                        }
                        onClick={() => {
                          setSelectedDifficulty(level);
                          setIsDifficultyOpen(false);
                        }}
                      >
                        {level === 'all'
                          ? tJourney('allLevels')
                          : tJourney(level)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className={styles.filterSelectWrap} ref={topicRef}>
                <button
                  className={styles.filterSelect}
                  onClick={() => {
                    setIsTopicOpen((current) => !current);
                    setIsDifficultyOpen(false);
                  }}
                >
                  <span className='material-symbols-outlined'>widgets</span>
                  {t('topic')}
                  <span className='material-symbols-outlined'>expand_more</span>
                </button>
                {isTopicOpen ? (
                  <div className={styles.filterMenu}>
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={
                          selectedTopicCategory === category
                            ? styles.filterMenuActive
                            : ''
                        }
                        onClick={() => {
                          setSelectedTopicCategory(category);
                          setIsTopicOpen(false);
                        }}
                      >
                        {category === 'all' ? t('allTopics') : category}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {filteredCards.map((card) => (
              <Link
                key={card.id}
                href={`/conversation/${card.id}`}
                className={styles.cardLink}
              >
                <article className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className={styles.cardImage}
                    />
                    <span
                      className={`${styles.badge} ${difficultyClass[card.difficulty]}`}
                    >
                      {card.difficulty}
                    </span>
                    <span className={styles.timeBadge}>
                      {card.estimatedTime} {t('mins')}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <h2>{card.title}</h2>
                    <p className={styles.cardDescription}>{card.description}</p>
                    <p className={styles.objectiveTitle}>{t('objectives')}</p>
                    <ul>
                      {card.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                    <div className={styles.startButton}>
                      {t('startPractice')}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <BottomFooter />
    </div>
  );
}
