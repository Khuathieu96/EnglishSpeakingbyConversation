"use client";

import { useMemo, useState } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import styles from '../PolishDashboard.module.css';
import { inProgressScenarioItems, polishAssets } from '../polishData';

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

function ScenarioCard({
  id,
  title,
  description,
  badge,
  image,
  icon,
  progress,
}: {
  id: string;
  title: string;
  description: string;
  badge: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  icon: string;
  progress: number;
}) {
  return (
    <Link
      href={`/conversation/${id}`}
      className={styles.scenarioCardLink}
    >
      <article className={styles.scenarioCard}>
        <div className={styles.scenarioImageWrap}>
          <img src={image} alt={title} className={styles.scenarioImage} />
          <div className={styles.scenarioImageOverlay} />
          <span
            className={
              badge === 'beginner'
                ? styles.badgeBeginner
                : badge === 'intermediate'
                  ? styles.badgeIntermediate
                  : styles.badgeAdvanced
            }
          >
            {badge}
          </span>
        </div>

        <div className={styles.scenarioBody}>
          <div className={styles.scenarioTitleRow}>
            <h3 className={styles.scenarioTitle}>{title}</h3>
            <img
              src={icon}
              alt=''
              aria-hidden='true'
              className={styles.scenarioIcon}
            />
          </div>
          <p className={styles.scenarioDescription}>{description}</p>
        </div>

        <div className={styles.scenarioProgressBlock}>
          <div className={styles.scenarioProgressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            {progress > 0 ? (
              <span className={styles.progressValue}>{progress}%</span>
            ) : (
              <img
                src={polishAssets.scenarioIcons.lock}
                alt=''
                aria-hidden='true'
                className={styles.progressLock}
              />
            )}
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

export function JourneySection() {
  const [activeFilter, setActiveFilter] = useState<LevelFilter>('all');
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return inProgressScenarioItems;
    }

    return inProgressScenarioItems.filter((item) => item.badge === activeFilter);
  }, [activeFilter]);

  const visibleItems = filteredItems.slice(0, 5);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 767) {
      return;
    }

    const container = scrollRef.current;
    if (!container) {
      return;
    }

    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = event.pageX - container.offsetLeft;
    dragStateRef.current.scrollLeft = container.scrollLeft;
    dragStateRef.current.moved = false;
    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || !dragStateRef.current.isDown) {
      return;
    }

    event.preventDefault();
    const currentX = event.pageX - container.offsetLeft;
    const distance = (currentX - dragStateRef.current.startX) * 1.2;

    if (Math.abs(distance) > 3) {
      dragStateRef.current.moved = true;
      suppressClickRef.current = true;
    }

    container.scrollLeft = dragStateRef.current.scrollLeft - distance;
  };

  const endDrag = () => {
    if (!dragStateRef.current.isDown) {
      return;
    }

    dragStateRef.current.isDown = false;
    setIsDragging(false);
  };

  const handleCardClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
    dragStateRef.current.moved = false;
  };

  return (
    <section className={styles.journeySection}>
      <div className={styles.journeyHeader}>
        <div>
          <h2 className={styles.journeyTitle}>Continue Your Journey</h2>
          <p className={styles.journeySubtitle}>
            Pick up where you left off or start a new challenge.
          </p>
        </div>

        <div className={styles.levelFilters}>
          <button
            className={activeFilter === 'all' ? styles.levelActive : styles.levelInactive}
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
          >
            All Levels
          </button>
          <button
            className={activeFilter === 'beginner' ? styles.levelActive : styles.levelInactive}
            onClick={() => setActiveFilter('beginner')}
            aria-pressed={activeFilter === 'beginner'}
          >
            Beginner
          </button>
          <button
            className={activeFilter === 'intermediate' ? styles.levelActive : styles.levelInactive}
            onClick={() => setActiveFilter('intermediate')}
            aria-pressed={activeFilter === 'intermediate'}
          >
            Intermediate
          </button>
          <button
            className={activeFilter === 'advanced' ? styles.levelActive : styles.levelInactive}
            onClick={() => setActiveFilter('advanced')}
            aria-pressed={activeFilter === 'advanced'}
          >
            Advanced
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`${styles.cardGrid} ${styles.cardGridDraggable} ${isDragging ? styles.cardGridDragging : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={handleCardClickCapture}
      >
        {visibleItems.map((item) => (
          <ScenarioCard key={item.id} {...item} />
        ))}
        <Link href='/scenarios' className={styles.scenarioCardLink}>
          <article className={styles.showMoreCard}>
            <span className='material-symbols-outlined'>apps</span>
            <h3>Show More</h3>
            <p>Explore all conversation categories</p>
          </article>
        </Link>
      </div>
    </section>
  );
}
