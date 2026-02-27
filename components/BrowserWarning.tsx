'use client';

import React, { useEffect, useState } from 'react';

type SpeechRecognitionConstructor = new () => EventTarget;

type BrowserSpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function BrowserWarning() {
  const [shouldShow, setShouldShow] = useState(false);
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    // Detect browser
    const userAgent = navigator.userAgent;
    let detectedBrowser = 'Unknown';

    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
      detectedBrowser = 'Chrome';
    } else if (userAgent.indexOf('Edg') > -1) {
      detectedBrowser = 'Edge';
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      detectedBrowser = 'Safari';
    } else if (userAgent.indexOf('Firefox') > -1) {
      detectedBrowser = 'Firefox';
    }

    setBrowserName(detectedBrowser);

    // Check if browser supports required APIs
    const browserWindow = window as BrowserSpeechWindow;
    const hasSpeechRecognitionApi = !!(
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition
    );
    const hasSpeechSynthesis = !!window.speechSynthesis;
    const hasMediaRecorder = !!window.MediaRecorder;

    const isFullySupported = hasSpeechRecognitionApi && hasSpeechSynthesis && hasMediaRecorder;
    const isRecommendedBrowser = detectedBrowser === 'Chrome' || detectedBrowser === 'Edge';

    if (!isFullySupported || !isRecommendedBrowser) {
      setShouldShow(true);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Browser Compatibility Notice
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You are using <strong>{browserName}</strong>. For the best
              experience with speech recognition and audio features, we recommend
              using <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
            </p>
            {browserName === 'Safari' && (
              <p className="mt-2">
                Safari has partial support for speech features. Some functionality
                may be limited.
              </p>
            )}
            {browserName === 'Firefox' && (
              <p className="mt-2">
                Firefox does not fully support Web Speech API. Please switch to
                Chrome or Edge.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
