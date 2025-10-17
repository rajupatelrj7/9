
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WritingSection } from './components/WritingSection';
import { SpeakingSection } from './components/SpeakingSection';
import { ReadingSection } from './components/ReadingSection';
import { ListeningSection } from './components/ListeningSection';
import type { Section } from './types';
import { TrophyIcon } from './components/icons';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('writing');

  const renderSection = useCallback(() => {
    switch (activeSection) {
      case 'writing':
        return <WritingSection />;
      case 'speaking':
        return <SpeakingSection />;
      case 'reading':
        return <ReadingSection />;
      case 'listening':
        return <ListeningSection />;
      default:
        return <WritingSection />;
    }
  }, [activeSection]);

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center gap-4">
          <TrophyIcon className="w-8 h-8 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IELTS Band 9 Coach</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your personal AI tutor for exam excellence</p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;
