
import React, { useState, useCallback } from 'react';
import { getWritingFeedback } from '../services/geminiService';
import { WRITING_TASK_1_PROMPT, WRITING_TASK_2_PROMPT } from '../constants';
import type { WritingFeedback } from '../types';
import { FeedbackCard } from './FeedbackCard';

type TaskType = 'Task 1' | 'Task 2';

const PromptCard: React.FC<{ title: string; prompt: string }> = ({ title, prompt }) => (
    <div className="p-4 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-gray-600 rounded-lg mb-4">
        <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{prompt}</p>
    </div>
);

export const WritingSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TaskType>('Task 1');
    const [task1Text, setTask1Text] = useState('');
    const [task2Text, setTask2Text] = useState('');
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setFeedback(null);

        const essay = activeTab === 'Task 1' ? task1Text : task2Text;
        const prompt = activeTab === 'Task 1' ? WRITING_TASK_1_PROMPT : WRITING_TASK_2_PROMPT;

        if (essay.trim().split(' ').length < 50) {
            setError('Please write a more complete essay (at least 50 words) to get effective feedback.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await getWritingFeedback(activeTab, prompt, essay);
            setFeedback(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, task1Text, task2Text]);

    const wordCount = (activeTab === 'Task 1' ? task1Text : task2Text).trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Writing Practice</h2>
            <div className="flex border-b border-gray-300 dark:border-gray-600">
                <button
                    onClick={() => { setActiveTab('Task 1'); setFeedback(null); setError(null); }}
                    className={`px-6 py-3 font-medium ${activeTab === 'Task 1' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Task 1
                </button>
                <button
                    onClick={() => { setActiveTab('Task 2'); setFeedback(null); setError(null); }}
                    className={`px-6 py-3 font-medium ${activeTab === 'Task 2' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Task 2
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <PromptCard title={activeTab} prompt={activeTab === 'Task 1' ? WRITING_TASK_1_PROMPT : WRITING_TASK_2_PROMPT} />
                    <textarea
                        value={activeTab === 'Task 1' ? task1Text : task2Text}
                        onChange={(e) => activeTab === 'Task 1' ? setTask1Text(e.target.value) : setTask2Text(e.target.value)}
                        className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder={`Write your ${activeTab} essay here...`}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Word Count: {wordCount}</p>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Getting Feedback...' : 'Get Feedback'}
                        </button>
                    </div>
                </div>

                <div className="h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    {error && <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</div>}
                    {feedback && <FeedbackCard feedback={feedback} />}
                </div>
            </div>
        </div>
    );
};
