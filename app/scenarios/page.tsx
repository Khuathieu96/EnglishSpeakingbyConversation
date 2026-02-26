"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { conversations } from '@/data/conversations';
import styles from './scenarios.module.css';

const difficultyClass: Record<'beginner' | 'intermediate' | 'advanced', string> = {
  beginner: styles.badgeBeginner,
  intermediate: styles.badgeIntermediate,
  advanced: styles.badgeAdvanced,
};

const stats = [
  { label: 'Current Streak', value: '12 Days', delta: '' },
  { label: 'Total Learning Time', value: '24h 15m', delta: '+1.6h' },
  { label: 'Scenarios Completed', value: '48', delta: '+5' },
  { label: 'Average Accuracy', value: '92%', delta: '+1%' },
] as const;

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyLabelMap: Record<DifficultyFilter, string> = {
  all: 'All Levels',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function ScenariosPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string>('all');
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
          : [`Practice ${conversation.category.toLowerCase()} vocabulary`, 'Build response fluency'],
      category: conversation.category,
    };
  });

  const categories = useMemo(
    () => ['all', ...new Set(conversations.map((conversation) => conversation.category))],
    []
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
        selectedDifficulty === 'all' ? true : card.difficulty === selectedDifficulty;

      const matchesTopicCategory =
        selectedTopicCategory === 'all'
          ? true
          : card.category.toLowerCase() === selectedTopicCategory.toLowerCase();

      return matchesDifficulty && matchesTopicCategory;
    });
  }, [cards, selectedDifficulty, selectedTopicCategory]);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>✈</div>
            <span className={styles.brandText}>EnglishHub</span>
            <nav className={styles.mainNav}>
              <a className={styles.activeNav}>Scenarios</a>
              <a>Tutor</a>
              <a>Community</a>
              <a>Profile</a>
            </nav>
          </div>

          <div className={styles.topActions}>
            <label className={styles.searchBox}>
              <span className='material-symbols-outlined'>search</span>
              <input type='text' defaultValue='Search scenarios...' aria-label='Search scenarios' />
            </label>
            <button className={styles.iconButton} aria-label='Notifications'>
              <span className='material-symbols-outlined'>notifications</span>
            </button>
            <div className={styles.avatar}>👤</div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.statsGrid}>
          {stats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
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
              <h1>Conversation Library</h1>
              <p>Master real-world English through interactive scenarios.</p>
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
                  {difficultyLabelMap[selectedDifficulty]}
                  <span className='material-symbols-outlined'>expand_more</span>
                </button>
                {isDifficultyOpen ? (
                  <div className={styles.filterMenu}>
                    {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map(
                      (level) => (
                        <button
                          key={level}
                          className={selectedDifficulty === level ? styles.filterMenuActive : ''}
                          onClick={() => {
                            setSelectedDifficulty(level);
                            setIsDifficultyOpen(false);
                          }}
                        >
                          {level === 'all' ? 'All Levels' : `${level[0].toUpperCase()}${level.slice(1)}`}
                        </button>
                      )
                    )}
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
                  Topic
                  <span className='material-symbols-outlined'>expand_more</span>
                </button>
                {isTopicOpen ? (
                  <div className={styles.filterMenu}>
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={selectedTopicCategory === category ? styles.filterMenuActive : ''}
                        onClick={() => {
                          setSelectedTopicCategory(category);
                          setIsTopicOpen(false);
                        }}
                      >
                        {category === 'all' ? 'All Topics' : category}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

            </div>
          </div>

          <div className={styles.cardGrid}>
            {filteredCards.map((card) => (
              <Link key={card.id} href={`/conversation/${card.id}`} className={styles.cardLink}>
                <article className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    <img src={card.image} alt={card.title} className={styles.cardImage} />
                    <span className={`${styles.badge} ${difficultyClass[card.difficulty]}`}>
                      {card.difficulty}
                    </span>
                    <span className={styles.timeBadge}>{card.estimatedTime} mins</span>
                  </div>

                  <div className={styles.cardBody}>
                    <h2>{card.title}</h2>
                    <p className={styles.cardDescription}>{card.description}</p>
                    <p className={styles.objectiveTitle}>Objectives:</p>
                    <ul>
                      {card.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                    <div className={styles.startButton}>Start Practice</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className={styles.discoverWrap}>
            <button className={styles.discoverButton}>
              Discover More Scenarios
              <span className='material-symbols-outlined'>expand_more</span>
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        © 2024 EnglishHub Learning. Designed for global communicators.
      </footer>
    </div>
  );
}
