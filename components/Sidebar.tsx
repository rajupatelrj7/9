
import React from 'react';
import type { Section } from '../types';
import { WritingIcon, SpeakingIcon, ReadingIcon, ListeningIcon } from './icons';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navItems: { id: Section; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'writing', label: 'Writing', icon: WritingIcon },
    { id: 'speaking', label: 'Speaking', icon: SpeakingIcon },
    { id: 'reading', label: 'Reading', icon: ReadingIcon },
    { id: 'listening', label: 'Listening', icon: ListeningIcon },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 flex-shrink-0 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">IELTS Prep</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
              activeSection === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-6 h-6 mr-3" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
         <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Powered by Google Gemini</p>
      </div>
    </aside>
  );
};
