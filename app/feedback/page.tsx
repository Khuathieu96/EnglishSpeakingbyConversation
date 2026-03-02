'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BottomFooter } from '@/app/dashboard/components/BottomFooter';
import { TopNav } from '@/app/dashboard/components/TopNav';
import styles from './feedback.module.css';

type SuccessStory = {
  id: string;
  name: string;
  achievement: string;
  quote: string;
  rating: number;
  initials: string;
};

const fallbackStories: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Nguyễn Minh Anh',
    achievement: 'IELTS Academic 8.0',
    quote:
      'SEC English đã thay đổi hoàn toàn cách mình luyện Speaking. Mình tăng từ 5.5 lên 7.5 chỉ sau 2 tháng!',
    rating: 5,
    initials: 'NA',
  },
  {
    id: 'story-2',
    name: 'Trần Huy Hoàng',
    achievement: 'Hoàn thành Business English',
    quote:
      'Những buổi chữa bài cá nhân với cô Hoài Linh là điểm mình thích nhất. Mình luôn cảm thấy được đồng hành mỗi ngày.',
    rating: 5,
    initials: 'TH',
  },
  {
    id: 'story-3',
    name: 'Lê Thu Thảo',
    achievement: 'IELTS General 7.0',
    quote:
      'Cuối cùng mình cũng tìm được nơi tập trung vào giao tiếp thực tế, không chỉ học thuộc lòng. Rất phù hợp cho người đi làm.',
    rating: 5,
    initials: 'LT',
  },
  {
    id: 'story-4',
    name: 'Phạm Gia Hân',
    achievement: 'TOEIC 930',
    quote:
      'Các bài luyện nói giúp mình tự tin hơn trong các cuộc họp thật. Giờ mình có thể thuyết trình bằng tiếng Anh mỗi tuần ở công ty.',
    rating: 5,
    initials: 'PH',
  },
  {
    id: 'story-5',
    name: 'Đỗ Khánh Linh',
    achievement: 'IELTS Speaking 8.0',
    quote:
      'Mình rất thích cách sửa bài ở đây. Mỗi buổi học đều thực tế, tập trung và áp dụng được ngay vào giao tiếp hằng ngày.',
    rating: 5,
    initials: 'DL',
  },
  {
    id: 'story-6',
    name: 'Vũ Thành Nam',
    achievement: 'Sẵn sàng du học',
    quote:
      'Chỉ sau 3 tháng, mình từ chỗ nói câu nào cũng ngập ngừng đã có thể giao tiếp tự nhiên với bạn bè quốc tế.',
    rating: 5,
    initials: 'VN',
  },
];

const MAX_NAME_LENGTH = 40;
const MAX_ACHIEVEMENT_LENGTH = 40;
const MAX_STORY_LENGTH = 150;
const COUNTDOWN_SECONDS = 2 * 60 * 60;
const COUNTDOWN_STORAGE_KEY = 'feedback-daily-countdown';

const getDayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function FeedbackPage() {
  const t = useTranslations('feedbackPage');
  const [stories, setStories] = useState<SuccessStory[]>(fallbackStories);
  const [feedbackImages, setFeedbackImages] = useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  const [name, setName] = useState('');
  const [achievement, setAchievement] = useState('');
  const [storyText, setStoryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await fetch(
          '/user-stories/student-success-stories.json',
        );
        if (!response.ok) {
          return;
        }
        const json = (await response.json()) as SuccessStory[];
        if (Array.isArray(json) && json.length > 0) {
          setStories(json);
        }
      } catch {
        setStories(fallbackStories);
      }
    };

    void loadStories();
  }, []);

  const renderedStories = useMemo(() => [...stories, ...stories], [stories]);

  useEffect(() => {
    let activeDayKey = getDayKey(new Date());
    let endTime = Date.now() + COUNTDOWN_SECONDS * 1000;

    const persistState = (dayKey: string, endAt: number) => {
      localStorage.setItem(
        COUNTDOWN_STORAGE_KEY,
        JSON.stringify({ dayKey, endTime: endAt }),
      );
    };

    const loadState = () => {
      const todayKey = getDayKey(new Date());
      const rawValue = localStorage.getItem(COUNTDOWN_STORAGE_KEY);

      if (rawValue) {
        try {
          const parsed = JSON.parse(rawValue) as {
            dayKey?: string;
            endTime?: number;
          };

          if (
            parsed.dayKey === todayKey &&
            typeof parsed.endTime === 'number' &&
            Number.isFinite(parsed.endTime)
          ) {
            activeDayKey = parsed.dayKey;
            endTime = parsed.endTime;
            return;
          }
        } catch {
          // Ignore invalid localStorage payload and recreate a fresh countdown.
        }
      }

      activeDayKey = todayKey;
      endTime = Date.now() + COUNTDOWN_SECONDS * 1000;
      persistState(activeDayKey, endTime);
    };

    const updateCountdown = () => {
      const now = new Date();
      const todayKey = getDayKey(now);

      if (todayKey !== activeDayKey) {
        activeDayKey = todayKey;
        endTime = Date.now() + COUNTDOWN_SECONDS * 1000;
        persistState(activeDayKey, endTime);
      }

      const secondsLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
    };

    loadState();
    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const loadFeedbackImages = async () => {
      try {
        const response = await fetch('/api/feedback-images');
        if (!response.ok) {
          return;
        }

        const json = (await response.json()) as string[];
        if (Array.isArray(json) && json.length > 0) {
          setFeedbackImages(json);
        }
      } catch {
        setFeedbackImages([]);
      }
    };

    void loadFeedbackImages();
  }, []);

  const countdown = useMemo(() => {
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    return {
      day: String(days).padStart(2, '0'),
      hour: String(hours).padStart(2, '0'),
      min: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0'),
    };
  }, [remainingSeconds]);

  const scrollCarousel = useCallback((direction: 'prev' | 'next') => {
    if (!carouselRef.current) {
      return;
    }

    const firstCard = carouselRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
    const gap = 24;
    const distance = cardWidth + gap;

    if (distance <= 0) {
      return;
    }

    carouselRef.current.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!carouselRef.current || feedbackImages.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const firstCard = carousel.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
      const gap = 24;
      const distance = cardWidth + gap;

      if (distance <= 0) {
        return;
      }

      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      const nextPosition = carousel.scrollLeft + distance;

      if (nextPosition >= maxScrollLeft - 1) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      carousel.scrollBy({ left: distance, behavior: 'smooth' });
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [feedbackImages.length]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/user-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          achievement: achievement.trim(),
          quote: storyText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to save story');
      }

      const savedStory = (await response.json()) as SuccessStory;
      setStories((prevStories) => [savedStory, ...prevStories]);
      setName('');
      setAchievement('');
      setStoryText('');
      setSubmitMessage({
        type: 'success',
        text: t('form.submitSuccess'),
      });
    } catch {
      setSubmitMessage({
        type: 'error',
        text: t('form.submitError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroBadge}>{t('hero.badge')}</div>
          <h1 className={styles.heroTitle}>
            {t('hero.titlePrefix')} <span>{t('hero.titleHighlight')}</span>
          </h1>
          <p className={styles.heroDescription}>{t('hero.description')}</p>
          <div className={styles.heroActions}>
            <Link
              href='https://anhngusec.edu.vn/mshoailinh'
              className={styles.primaryButton}
            >
              {t('hero.cta')}
            </Link>
          </div>
        </section>

        <section className={styles.feedbackSection}>
          <h2>{t('feedbackSection.title')}</h2>

          <div className={styles.carouselWrap}>
            <button
              type='button'
              aria-label={t('feedbackSection.previousAriaLabel')}
              onClick={() => scrollCarousel('prev')}
              className={`${styles.carouselArrow} ${styles.leftArrow}`}
            >
              <span className='material-symbols-outlined'>chevron_left</span>
            </button>

            <div className={styles.carouselTrack} ref={carouselRef}>
              {feedbackImages.map((image) => (
                <article key={image} className={styles.feedbackCard}>
                  <img
                    src={image}
                    alt={t('feedbackSection.cardImageAlt')}
                    loading='lazy'
                  />
                </article>
              ))}
            </div>

            <button
              type='button'
              aria-label={t('feedbackSection.nextAriaLabel')}
              onClick={() => scrollCarousel('next')}
              className={`${styles.carouselArrow} ${styles.rightArrow}`}
            >
              <span className='material-symbols-outlined'>chevron_right</span>
            </button>
          </div>
        </section>

        <section className={styles.storiesSection}>
          <header className={styles.sectionHeader}>
            <h2>{t('stories.title')}</h2>
            <p>{t('stories.subtitle')}</p>
          </header>

          <div className={styles.storiesLoopViewport}>
            <div className={styles.storiesLoopTrack}>
              {renderedStories.map((story, index) => (
                <article key={`${story.id}-${index}`} className={styles.storyCard}>
                <p className={styles.storyRating}>{'★'.repeat(story.rating)}</p>
                <p className={styles.storyQuote}>&quot;{story.quote}&quot;</p>

                <div className={styles.storyAuthor}>
                  <div className={styles.storyAvatar}>{story.initials}</div>
                  <div>
                    <p className={styles.storyName}>{story.name}</p>
                    <p className={styles.storyAchievement}>
                      {story.achievement}
                    </p>
                  </div>
                </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.formCard}>
            <header className={styles.sectionHeader}>
              <h2>{t('form.title')}</h2>
              <p>{t('form.subtitle')}</p>
            </header>

            <form className={styles.storyForm} onSubmit={handleSubmit}>
              <div className={styles.rowInputs}>
                <label className={styles.formField}>
                  <span>{t('form.fullNameLabel')}</span>
                  <input
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t('form.fullNamePlaceholder')}
                    required
                    maxLength={MAX_NAME_LENGTH}
                  />
                </label>
                <label className={styles.formField}>
                  <span>{t('form.achievementLabel')}</span>
                  <input
                    type='text'
                    value={achievement}
                    onChange={(event) => setAchievement(event.target.value)}
                    placeholder={t('form.achievementPlaceholder')}
                    required
                    maxLength={MAX_ACHIEVEMENT_LENGTH}
                  />
                </label>
              </div>

              <label className={styles.formField}>
                <span>{t('form.storyLabel')}</span>
                <textarea
                  value={storyText}
                  onChange={(event) => setStoryText(event.target.value)}
                  placeholder={t('form.storyPlaceholder')}
                  required
                  maxLength={MAX_STORY_LENGTH}
                />
              </label>

              {submitMessage ? (
                <p
                  className={
                    submitMessage.type === 'success'
                      ? styles.submitSuccess
                      : styles.submitError
                  }
                  role='status'
                  aria-live='polite'
                >
                  {submitMessage.text}
                </p>
              ) : null}

              <button
                type='submit'
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form.submitting') : t('form.submitButton')}
              </button>
            </form>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.offerCard}>
            <div className={styles.offerTopBar}>
              <div className={styles.offerInfo}>
                <img
                  src='/logo.jpg'
                  alt={t('offer.imageAlt')}
                  className={styles.offerAvatar}
                  loading='lazy'
                />
                <div>
                  <h2 className={styles.offerTitle}>{t('offer.title')}</h2>
                  <p className={styles.offerLine}>
                    {t('offer.line1Prefix')}{' '}
                    <span>{t('offer.line1Value')}</span>
                  </p>
                  <p className={styles.offerLine}>
                    {t('offer.line2Prefix')} <span>{t('offer.line2Value')}</span>
                  </p>
                </div>
              </div>

              <Link href='https://anhngusec.edu.vn/mshoailinh' className={styles.offerTopButton}>
                {t('offer.topButton')}
              </Link>
            </div>

            <div className={styles.offerMainArea}>
              <div className={styles.offerTimer}>
                <div className={styles.offerTimeUnit}>
                  <span className={styles.offerTimeValue}>{countdown.day}</span>
                  <span className={styles.offerTimeLabel}>{t('offer.timer.day')}</span>
                </div>
                <div className={styles.offerTimeUnit}>
                  <span className={styles.offerTimeValue}>{countdown.hour}</span>
                  <span className={styles.offerTimeLabel}>{t('offer.timer.hour')}</span>
                </div>
                <div className={styles.offerTimeUnit}>
                  <span className={styles.offerTimeValue}>{countdown.min}</span>
                  <span className={styles.offerTimeLabel}>{t('offer.timer.min')}</span>
                </div>
                <div className={styles.offerTimeUnit}>
                  <span className={styles.offerTimeValue}>{countdown.sec}</span>
                  <span className={styles.offerTimeLabel}>{t('offer.timer.sec')}</span>
                </div>
              </div>

              <div className={styles.offerHeadlineBox}>
                <h3>{t('offer.headline')}</h3>
              </div>

              <Link href='https://anhngusec.edu.vn/mshoailinh' className={styles.offerMainButton}>
                {t('offer.mainButton')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BottomFooter />
    </div>
  );
}
