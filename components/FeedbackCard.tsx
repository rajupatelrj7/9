
import React from 'react';
import type { WritingFeedback, CriterionFeedback } from '../types';

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const percentage = (score / 9) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 dark:text-gray-600"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-blue-600"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white">
        {score.toFixed(1)}
      </span>
    </div>
  );
};

const FeedbackDetail: React.FC<{ title: string; data: CriterionFeedback }> = ({ title, data }) => (
    <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
            <span className="font-bold text-lg text-blue-600">{data.score.toFixed(1)}</span>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{data.feedback}</p>
    </div>
);

export const FeedbackCard: React.FC<{ feedback: WritingFeedback }> = ({ feedback }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Overall Band Score</h3>
                <div className="flex justify-center my-4">
                    <ScoreCircle score={feedback.overallBand} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Detailed Assessment</h3>
                <FeedbackDetail title="Task Achievement / Response" data={feedback.taskAchievement} />
                <FeedbackDetail title="Coherence and Cohesion" data={feedback.coherenceCohesion} />
                <FeedbackDetail title="Lexical Resource" data={feedback.lexicalResource} />
                <FeedbackDetail title="Grammatical Range and Accuracy" data={feedback.grammaticalRange} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Corrected Essay</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg prose prose-sm dark:prose-invert max-w-none">
                    <p>{feedback.correctedEssay}</p>
                </div>
            </div>
        </div>
    );
};
