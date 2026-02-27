'use client';

import { useLocaleSwitch } from './LocaleProvider';

export function LanguageToggle() {
  const { locale, setLocale } = useLocaleSwitch();

  const toggle = () => {
    setLocale(locale === 'vi' ? 'en' : 'vi');
  };

  return (
    <button
      onClick={toggle}
      aria-label={
        locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'
      }
      title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 10px',
        borderRadius: '20px',
        border: '1.5px solid #d1d5db',
        background: '#fff',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        color: '#374151',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span className='material-symbols-outlined' style={{ fontSize: '18px' }}>
        translate
      </span>
      <span>{locale === 'vi' ? 'EN' : 'VI'}</span>
    </button>
  );
}
