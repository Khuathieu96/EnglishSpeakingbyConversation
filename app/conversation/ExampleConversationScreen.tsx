'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './conversation.module.css';
import { conversations, getConversationById } from '@/data/conversations';
import { useConversationBot } from '@/hooks/useConversationBot';
import { CompletionScreen } from '@/components/CompletionScreen';
import { BrowserWarning } from '@/components/BrowserWarning';

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

const idAliasMap: Record<string, string> = {
  'meeting-people': 'meeting-new-people',
  'booking-flight': 'at-the-airport',
};

interface ExampleConversationScreenProps {
  conversationId?: string;
}

export function ExampleConversationScreen({
  conversationId = 'meeting-new-people',
}: ExampleConversationScreenProps) {
  const resolvedConversationId = idAliasMap[conversationId] ?? conversationId;
  const conversation = getConversationById(resolvedConversationId) ?? conversations[0];
  const [hasStarted, setHasStarted] = useState(false);

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
      ? Math.min(100, (botState.statistics.completedLines / userLineCount) * 100)
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

  const isListening = speechRecognition.isListening || audioRecorder.isRecording;
  const canSpeak = botState.state === 'waiting_for_user';

  if (botState.conversationComplete) {
    return (
      <CompletionScreen
        conversationTitle={conversation.title}
        statistics={botState.statistics}
        mergedAudio={audioRecorder.mergedAudio}
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
          <header className={styles.desktopHeader}>
            <div className={styles.brandWrap}>
              <div className={styles.brandIcon}>✚</div>
              <p className={styles.brandText}>English Practice</p>
            </div>

            <nav className={styles.desktopNav}>
              <a href='#'>Lessons</a>
              <a href='#'>Progress</a>
              <a href='#'>Community</a>
            </nav>

            <div className={styles.desktopActions}>
              <button aria-label='Settings'>
                <span className='material-symbols-outlined'>settings</span>
              </button>
              <img src={desktopUserImage} alt='User profile' />
            </div>
          </header>

          <div className={styles.desktopMain}>
            <aside className={styles.desktopAside}>
              <div className={styles.asideTop}>
                <span className={styles.introPill}>Introduction</span>
                <h1>{conversation.title}</h1>
                <p>{conversation.description}</p>

                <div className={styles.asideSection}>
                  <h2>Learning Objectives</h2>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={objective.label}
                        className={objective.done ? styles.objectiveDone : undefined}
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.asideSection}>
                  <h2>Key Phrases</h2>
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
                  <p className={styles.proTipTitle}>Pro Tip</p>
                  <p className={styles.proTipText}>
                    Try to match the tutor&apos;s tone for better fluency scores.
                  </p>
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
                      {botState.state === 'ai_speaking' ? 'Speaking...' : 'Listening...'}
                    </p>
                  </div>
                </div>
                <div className={styles.chatTools}>
                  <button aria-label='Translate'>
                    <span className='material-symbols-outlined'>translate</span>
                  </button>
                  <button aria-label='Volume'>
                    <span className='material-symbols-outlined'>volume_up</span>
                  </button>
                </div>
              </div>

              <div className={styles.desktopMessages}>
                {displayLines.map((line, index) => {
                  const transcript = botState.userTranscripts[index];
                  const isUser = line.speaker === 'user';

                  return (
                    <div
                      key={line.id}
                      className={isUser ? styles.desktopRowUser : styles.desktopRowAi}
                    >
                      {!isUser && (
                        <img
                          src={desktopAiImage}
                          alt='AI avatar'
                          className={styles.messageAvatar}
                        />
                      )}

                      <div className={styles.messageCol}>
                        <div className={isUser ? styles.userBubble : styles.aiBubble}>
                          {isUser && transcript ? transcript : line.text}
                        </div>
                        <p className={isUser ? styles.stampUser : styles.stampAi}>
                          {isUser ? 'You' : 'Alex'} • Just now
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
                    Match score: {Math.round(botState.matchingResult.similarity)}%
                    {!botState.matchingResult.passed && (
                      <span> • Expected: “{botState.matchingResult.expected}”</span>
                    )}
                  </div>
                )}

                {botState.state === 'show_answer' && currentLine && (
                  <div className={styles.answerBox}>
                    Correct answer: “{currentLine.text}”
                  </div>
                )}
              </div>

              <div className={styles.desktopComposer}>
                <div className={styles.progressMeta}>
                  <p>{conversation.title}</p>
                  <p>
                    {botState.statistics.completedLines}/{userLineCount} phrases
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
                    ? `Say: “${currentLine.text}”`
                    : 'Wait for AI to finish speaking...'}
                </div>

                <div className={styles.desktopControls}>
                  <button
                    onClick={handleUserSpeak}
                    disabled={!canSpeak || isListening}
                    className={styles.primaryBtn}
                  >
                    {isListening ? 'Listening...' : 'Tap to Speak'}
                  </button>

                  {isListening ? (
                    <button onClick={handleStopSpeaking} className={styles.stopBtn}>
                      Stop
                    </button>
                  ) : (
                    <button onClick={handleSkipLine} className={styles.skipBtn}>
                      Skip
                    </button>
                  )}
                </div>

                {remainingAttempts < 3 && (
                  <p className={styles.attemptsText}>
                    Attempts remaining: {remainingAttempts}
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
                <p className={styles.mobileTutorRole}>AI Language Tutor</p>
              </div>
            </div>

            <div className={styles.mobileTopActions}>
              <button aria-label='Information'>
                <span className='material-symbols-outlined'>info</span>
              </button>
              <button aria-label='More'>
                <span className='material-symbols-outlined'>more_vert</span>
              </button>
            </div>
          </header>

          <section className={styles.mobileLessonFocusWrap}>
            <details className={styles.mobileLessonFocusDetails}>
              <summary className={styles.mobileLessonFocus}>
                <span className='material-symbols-outlined'>auto_awesome</span>
                <span>Lesson Focus</span>
                <span className='material-symbols-outlined'>expand_more</span>
              </summary>

              <div className={styles.mobileLessonPaper}>
                <span className={styles.introPill}>Introduction</span>
                <h2 className={styles.mobilePaperTitle}>{conversation.title}</h2>
                <p className={styles.mobilePaperDesc}>{conversation.description}</p>

                <div className={styles.mobilePaperSection}>
                  <h3>Learning Objectives</h3>
                  <ul>
                    {lessonObjectives.map((objective) => (
                      <li
                        key={`mobile-${objective.label}`}
                        className={objective.done ? styles.objectiveDone : undefined}
                      >
                        {objective.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.mobilePaperSection}>
                  <h3>Key Phrases</h3>
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
                    <p className={styles.proTipTitle}>Pro Tip</p>
                    <p className={styles.proTipText}>
                      Try to match the tutor&apos;s tone for better fluency scores.
                    </p>
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
                    <div className={isUser ? styles.mobileUserBubble : styles.mobileAiBubble}>
                      {isUser && transcript ? transcript : line.text}
                      {!isUser && index === displayLines.length - 1 && (
                        <button className={styles.mobileTranslationBtn}>
                          Show Translation
                        </button>
                      )}
                    </div>
                    <p className={isUser ? styles.mobileStampUser : styles.mobileStampAi}>
                      {isUser ? 'You' : 'Elena'} • Just now
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
            <div className={styles.mobileInputControl}>
              <input
                readOnly
                placeholder={
                  currentLine?.speaker === 'user'
                    ? `Say: ${currentLine.text}`
                    : 'Type your response...'
                }
              />
              <button aria-label='Send message'>
                <span className='material-symbols-outlined'>send</span>
              </button>
            </div>

            <div className={styles.mobileVoiceWrap}>
              <button
                className={styles.mobileVoiceBtn}
                aria-label='Tap to speak'
                onClick={isListening ? handleStopSpeaking : handleUserSpeak}
                disabled={!canSpeak && !isListening}
              >
                <span className='material-symbols-outlined'>mic</span>
              </button>
              <p>{isListening ? 'Stop' : 'Tap to Speak'}</p>
            </div>

            <div className={styles.mobileProgressWrap}>
              <div className={styles.mobileProgressMeta}>
                <p>
                  {botState.statistics.completedLines}/{userLineCount}
                </p>
                <p>Attempts: {remainingAttempts}</p>
              </div>
              <div className={styles.mobileProgressTrack}>
                <div
                  className={styles.mobileProgressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <nav className={styles.mobileBottomNav}>
              <a href='#' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>home</span>
                <span>Home</span>
              </a>
              <a href='#' className={`${styles.mobileNavItem} ${styles.mobileActive}`}>
                <span className='material-symbols-outlined'>chat_bubble</span>
                <span>Practice</span>
              </a>
              <a href='#' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>menu_book</span>
                <span>Library</span>
              </a>
              <a href='#' className={styles.mobileNavItem}>
                <span className='material-symbols-outlined'>person</span>
                <span>Profile</span>
              </a>
            </nav>
          </footer>
        </div>
      </div>
    </>
  );
}
