
import React from 'react';
import { ListeningIcon } from './icons';

export const ListeningSection: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-10 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <ListeningIcon className="w-24 h-24 text-blue-500"/>
            </div>
            <h2 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">Listening Section Coming Soon</h2>
            <p className="mt-4 max-w-md text-gray-600 dark:text-gray-400">
                We're fine-tuning our interactive listening exercises to provide you with the best practice experience. Stay tuned for updates!
            </p>
        </div>
    );
};
