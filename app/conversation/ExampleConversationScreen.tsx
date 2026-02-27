'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './conversation.module.css';
import { conversations, getConversationById } from '@/data/conversations';
import { useConversationBot } from '@/hooks/useConversationBot';
import { CompletionScreen } from '@/components/CompletionScreen';
import { BrowserWarning } from '@/components/BrowserWarning';
import { AppHeader } from '@/app/dashboard/components/AppHeader';

const desktopUserImage =
  'https://www.figma.com/api/mcp/asset/182d7cc0-77f7-42a3-b9d2-239e22c20204';
const desktopAiImage =
  'https://www.figma.com/api/mcp/asset/bf818f5e-3134-418e-b3df-dea74ded9c0c';
const mobileTutorImage =
  'https://www.figma.com/api/mcp/asset/ea609369-ebd2-48c4-be63-616a0d14ac04';

const lessonObjectives = [
  { label: 'Use "Nice to meet you"', done: true },
  { label: 'Ask 3 follow-up questions', done: false },
  { label: 'Practice present simple tense', done: false },
];

const keyPhrases = [
  "How's it going?",
  'Pleasure to meet you',
  'What do you do for fun?',
  'Likewise!',
  'Nice to meet you too',
];

interface ExampleConversationScreenProps {
  conversationId?: string;
}

export function ExampleConversationScreen({
  conversationId = 'meeting-new-people',
}: ExampleConversationScreenProps) {
  const conversation = getConversationById(conversationId) ?? conversations[0];
  const [hasStarted, setHasStarted] = useState(false);
  const t = useTranslations('conversation');
  const tChat = useTranslations('chat');

  const {
    botState,
    currentLine,
    speechRecognition,
    audioRecorder,
    startConversation,
    handleUserSpeak,
    handleStopSpeaking,
    handleSkipLine,
    reset,
    remainingAttempts,
  } = useConversationBot({
    conversation,
    onComplete: () => {
      // completion handled by UI state
    },
  });

  useEffect(() => {
    if (hasStarted) return;

    const timer = setTimeout(() => {
      startConversation();
      setHasStarted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [hasStarted, startConversation]);

  const userLineCount = useMemo(
    () => conversation.lines.filter((line) => line.speaker === 'user').length,
    [conversation.lines],
  );

  const progressPercent =
    userLineCount > 0
      ? Math.min(
          100,
          (botState.statistics.completedLines / userLineCount) * 100,
        )
      : 0;

  const hasCurrentUserTranscript =
    currentLine?.speaker === 'user' &&
    !!botState.userTranscripts[botState.currentLineIndex];

  const shouldShowCurrentLine =
    botState.state === 'ai_speaking' ||
    botState.state === 'processing' ||
    botState.state === 'retry' ||
    botState.state === 'success' ||
    botState.state === 'show_answer' ||
    hasCurrentUserTranscript;

  const displayLines = shouldShowCurrentLine
    ? conversation.lines.slice(0, botState.currentLineIndex + 1)
    : conversation.lines.slice(0, botState.currentLineIndex);

  const isListening =
    speechRecognition.isListening || audioRecorder.isRecording;
  const canSpeak = botState.state === 'waiting_for_user';

  if (botState.conversationComplete) {
    return (
      <CompletionScreen
        conversationTitle={conversation.title}
        statistics={botState.statistics}
        onRestart={() => {
          reset();
          setHasStarted(false);
        }}
      />
    );
  }

  return (
    <>
      <div className={styles.desktopOnly}>
        <div className={styles.desktopPage}>
          <AppHeader />

          <div className={styles.desktopMain}>
            <aside className={styles.desktopAside}>
              <div className={styles.asideTop}>
                <span className={styles.introPill}>{t('introduction')}</span>
                <h1>{conversation.title}</h1>
                <p>{conversation.description}</p>

                <div className={styles.asideSection}>
                  <h2>{t('learningObjectives')}</h2>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={objective.label}
                        className={
                          objective.done ? styles.objectiveDone : undefined
                        }
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.asideSection}>
                  <h2>{t('keyPhrases')}</h2>
                  <div className={styles.phrases}>
                    {keyPhrases.map((phrase) => (
                      <span key={phrase}>{phrase}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.proTip}>
                <div className={styles.proTipIcon}>
                  <span className='material-symbols-outlined'>lightbulb</span>
                </div>
                <div>
                  <p className={styles.proTipTitle}>{t('proTip')}</p>
                  <p className={styles.proTipText}>{t('proTipText')}</p>
                </div>
              </div>
            </aside>

            <section className={styles.desktopChatSection}>
              <div className={styles.browserWarningWrap}>
                <BrowserWarning />
              </div>

              <div className={styles.desktopChatHeader}>
                <div className={styles.tutorWrap}>
                  <div className={styles.tutorAvatarWrap}>
                    <img src={mobileTutorImage} alt='Tutor avatar' />
                    <span className={styles.onlineDot} />
                  </div>
                  <div>
                    <p className={styles.tutorName}>Alex</p>
                    <p className={styles.tutorState}>
                      {botState.state === 'ai_speaking'
                        ? t('speaking')
                        : t('listening')}
                    </p>
                  </div>
                </div>
                <div className={styles.chatTools}></div>
              </div>

              <div className={styles.desktopMessages}>
                {displayLines.map((line, index) => {
                  const transcript = botState.userTranscripts[index];
                  const isUser = line.speaker === 'user';

                  return (
                    <div
                      key={line.id}
                      className={
                        isUser ? styles.desktopRowUser : styles.desktopRowAi
                      }
                    >
                      {!isUser && (
                        <img
                          src={desktopAiImage}
                          alt='AI avatar'
                          className={styles.messageAvatar}
                        />
                      )}

                      <div className={styles.messageCol}>
                        <div
                          className={
                            isUser ? styles.userBubble : styles.aiBubble
                          }
                        >
                          {isUser && transcript ? transcript : line.text}
                        </div>
                        <p
                          className={isUser ? styles.stampUser : styles.stampAi}
                        >
                          {isUser ? t('you') : 'Alex'} • {t('justNow')}
                        </p>
                      </div>

                      {isUser && (
                        <img
                          src={desktopUserImage}
                          alt='User avatar'
                          className={styles.messageAvatar}
                        />
                      )}
                    </div>
                  );
                })}

                {botState.matchingResult && (
                  <div
                    className={
                      botState.matchingResult.passed
                        ? styles.matchSuccess
                        : styles.matchError
                    }
                  >
                    Match score:{' '}
                    {Math.round(botState.matchingResult.similarity)}%
                    {!botState.matchingResult.passed && (
                      <span>
                        {' '}
                        •{' '}
                        {t('expected', {
                          text: botState.matchingResult.expected,
                        })}
                      </span>
                    )}
                  </div>
                )}

                {botState.state === 'show_answer' && currentLine && (
                  <div className={styles.answerBox}>
                    {t('correctAnswer', { text: currentLine.text })}
                  </div>
                )}
              </div>

              <div className={styles.desktopComposer}>
                <div className={styles.progressMeta}>
                  <p>{conversation.title}</p>
                  <p>
                    {botState.statistics.completedLines}/{userLineCount}{' '}
                    {t('phrases')}
                  </p>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className={styles.hintBox}>
                  {currentLine?.speaker === 'user'
                    ? t('sayHint', { text: currentLine.text })
                    : t('waitForAi')}
                </div>

                <div className={styles.desktopControls}>
                  <button
                    onClick={handleUserSpeak}
                    disabled={!canSpeak || isListening}
                    className={styles.primaryBtn}
                  >
                    {isListening ? t('listening') : t('tapToSpeak')}
                  </button>

                  {isListening ? (
                    <button
                      onClick={handleStopSpeaking}
                      className={styles.stopBtn}
                    >
                      {t('stop')}
                    </button>
                  ) : (
                    <button onClick={handleSkipLine} className={styles.skipBtn}>
                      {t('skip')}
                    </button>
                  )}
                </div>

                {remainingAttempts < 3 && (
                  <p className={styles.attemptsText}>
                    {t('attemptsRemaining', { count: remainingAttempts })}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className={styles.mobileOnly}>
        <div className={styles.mobilePage}>
          <header className={styles.mobileTopBar}>
            <div className={styles.mobileTutorInfo}>
              <div className={styles.mobileTutorAvatarWrap}>
                <img src={mobileTutorImage} alt='Elena AI tutor' />
                <span className={styles.onlineDot} />
              </div>
              <div>
                <p className={styles.mobileTutorName}>Elena</p>
                <p className={styles.mobileTutorRole}>{t('aiTutor')}</p>
              </div>
            </div>

            <div className={styles.mobileTopActions}></div>
          </header>

          <section className={styles.mobileLessonFocusWrap}>
            <details className={styles.mobileLessonFocusDetails}>
              <summary className={styles.mobileLessonFocus}>
                <span className='material-symbols-outlined'>auto_awesome</span>
                <span>{t('lessonFocus')}</span>
                <span className='material-symbols-outlined'>expand_more</span>
              </summary>

              <div className={styles.mobileLessonPaper}>
                <span className={styles.introPill}>{t('introduction')}</span>
                <h2 className={styles.mobilePaperTitle}>
                  {conversation.title}
                </h2>
                <p className={styles.mobilePaperDesc}>
                  {conversation.description}
                </p>

                <div className={styles.mobilePaperSection}>
                  <h3>{t('learningObjectives')}</h3>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={`mobile-${objective.label}`}
                        className={
                          objective.done ? styles.objectiveDone : undefined
                        }
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.mobilePaperSection}>
                  <h3>{t('keyPhrases')}</h3>
                  <div className={styles.phrases}>
                    {keyPhrases.map((phrase) => (
                      <span key={`mobile-${phrase}`}>{phrase}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.mobilePaperProTip}>
                  <div className={styles.proTipIcon}>
                    <span className='material-symbols-outlined'>lightbulb</span>
                  </div>
                  <div>
                    <p className={styles.proTipTitle}>{t('proTip')}</p>
                    <p className={styles.proTipText}>{t('proTipText')}</p>
                  </div>
                </div>
              </div>
            </details>
          </section>

          <main className={styles.mobileChatArea}>
            <div className={styles.mobileTimestamp}>Today, 10:45 AM</div>

            {displayLines.map((line, index) => {
              const transcript = botState.userTranscripts[index];
              const isUser = line.speaker === 'user';

              return (
                <div
                  key={line.id}
                  className={isUser ? styles.mobileRowUser : styles.mobileRowAi}
                >
                  {!isUser && (
                    <div className={styles.mobileSmallIcon}>
                      <span className='material-symbols-outlined'>work</span>
                    </div>
                  )}

                  <div className={styles.mobileMessageContent}>
                    <div
                      className={
                        isUser ? styles.mobileUserBubble : styles.mobileAiBubble
                      }
                    >
                      {isUser && transcript ? transcript : line.text}
                    </div>
                    <p
                      className={
                        isUser ? styles.mobileStampUser : styles.mobileStampAi
                      }
                    >
                      {isUser ? t('you') : 'Elena'} • {t('justNow')}
                    </p>
                  </div>

                  {isUser && (
                    <div className={styles.mobileSmallIconUser}>
                      <span className='material-symbols-outlined'>person</span>
                    </div>
                  )}
                </div>
              );
            })}

            {botState.matchingResult && (
              <div
                className={
                  botState.matchingResult.passed
                    ? styles.mobileMatchSuccess
                    : styles.mobileMatchError
                }
              >
                Match: {Math.round(botState.matchingResult.similarity)}%
              </div>
            )}

            <div className={styles.mobileTypingRow}>
              <div className={styles.mobileSmallIconMuted}>
                <span className='material-symbols-outlined'>work</span>
              </div>
              <div className={styles.mobileTypingDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </main>

          <footer className={styles.mobileBottomControls}>
            <div className={styles.mobileVoiceWrap}>
              <button
                className={`${styles.mobileVoiceBtn} ${isListening ? styles.mobileVoiceBtnListening : ''}`}
                aria-label='Tap to speak'
                onClick={isListening ? handleStopSpeaking : handleUserSpeak}
                disabled={!canSpeak && !isListening}
              >
                <span className='material-symbols-outlined'>mic</span>
              </button>
              <p>{isListening ? t('stop') : t('tapToSpeak')}</p>
            </div>

            <div className={styles.mobileProgressWrap}>
              <div className={styles.mobileProgressMeta}>
                <p>
                  {botState.statistics.completedLines}/{userLineCount}
                </p>
                <p>{t('attempts', { count: remainingAttempts })}</p>
              </div>
              <div className={styles.mobileProgressTrack}>
                <div
                  className={styles.mobileProgressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <nav className={styles.mobileBottomNav}>
              <Link href='/' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>home</span>
                <span>{t('home')}</span>
              </Link>
              <span
                className={`${styles.mobileNavItem} ${styles.mobileActive}`}
              >
                <span className='material-symbols-outlined'>chat_bubble</span>
                <span>{t('practice')}</span>
              </span>
              <Link href='/scenarios' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>menu_book</span>
                <span>{t('libraryNav')}</span>
              </Link>
            </nav>
          </footer>
        </div>
      </div>
    </>
  );
}
