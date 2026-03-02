'use client';

import { useMemo, useState } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from '../Dashboard.module.css';
import { journeyScenarioItems, dashboardAssets } from '../dashboardData';

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

function ScenarioCard({
  id,
  title,
  description,
  image,
  icon,
  progress,
}: {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  progress: number;
}) {
  const t = useTranslations('journey');
  return (
    <Link href={`/conversation/${id}`} className={styles.scenarioCardLink}>
      <article className={styles.scenarioCard}>
        <div className={styles.scenarioImageWrap}>
          <img src={image} alt={title} className={styles.scenarioImage} />
          <div className={styles.scenarioImageOverlay} />
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
            <span className={styles.progressLabel}>{t('progress')}</span>
            {progress > 0 ? (
              <span className={styles.progressValue}>{progress}%</span>
            ) : (
              <img
                src={dashboardAssets.scenarioIcons.lock}
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
  const t = useTranslations('journey');
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
      return journeyScenarioItems;
    }

    return journeyScenarioItems.filter((item) => item.badge === activeFilter);
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
          <h2 className={styles.journeyTitle}>{t('title')}</h2>
          <p className={styles.journeySubtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.levelFilters}>
          <button
            className={
              activeFilter === 'all' ? styles.levelActive : styles.levelInactive
            }
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
          >
            {t('allLevels')}
          </button>
          <button
            className={
              activeFilter === 'beginner'
                ? styles.levelActive
                : styles.levelInactive
            }
            onClick={() => setActiveFilter('beginner')}
            aria-pressed={activeFilter === 'beginner'}
          >
            {t('beginner')}
          </button>
          <button
            className={
              activeFilter === 'intermediate'
                ? styles.levelActive
                : styles.levelInactive
            }
            onClick={() => setActiveFilter('intermediate')}
            aria-pressed={activeFilter === 'intermediate'}
          >
            {t('intermediate')}
          </button>
          <button
            className={
              activeFilter === 'advanced'
                ? styles.levelActive
                : styles.levelInactive
            }
            onClick={() => setActiveFilter('advanced')}
            aria-pressed={activeFilter === 'advanced'}
          >
            {t('advanced')}
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
            <h3>{t('showMore')}</h3>
            <p>{t('exploreAll')}</p>
          </article>
        </Link>
      </div>
    </section>
  );
}
