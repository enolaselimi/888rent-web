import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-red-500 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => setLanguage('al')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          language === 'al'
            ? 'bg-red-500 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-700'
        }`}
      >
        ALB
      </button>
    </div>
  );
};

export default LanguageToggle;