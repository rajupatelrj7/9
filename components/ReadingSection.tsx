
import React, { useState } from 'react';

const readingPassage = {
    title: "The Rise of Artificial Intelligence",
    text: "Artificial intelligence (AI) is rapidly transforming our world. From automating mundane tasks to powering complex algorithms that can diagnose diseases, AI's influence is widespread and growing. One of the key drivers of this revolution is machine learning, a subset of AI where systems learn from data, identify patterns, and make decisions with minimal human intervention. This technology underpins everything from recommendation engines on streaming services to the development of self-driving cars. However, the rapid advancement of AI also raises important ethical questions. Concerns about job displacement, algorithmic bias, and data privacy are paramount. As we continue to integrate AI into society, it is crucial to establish robust frameworks for governance and ethical oversight to ensure that these powerful tools are used responsibly and for the benefit of all humanity.",
    questions: [
        {
            question: "What is a key driver of the AI revolution mentioned in the text?",
            options: ["Data privacy", "Ethical oversight", "Machine learning", "Job displacement"],
            answer: "Machine learning"
        },
        {
            question: "Which of the following is NOT listed as a concern related to AI?",
            options: ["Algorithmic bias", "Improved streaming recommendations", "Data privacy", "Job displacement"],
            answer: "Improved streaming recommendations"
        },
        {
            question: "According to the passage, what is necessary to ensure AI is used responsibly?",
            options: ["Slowing down AI development", "Limiting AI to specific industries", "Governance and ethical oversight", "Minimal human intervention"],
            answer: "Governance and ethical oversight"
        }
    ]
};

export const ReadingSection: React.FC = () => {
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(readingPassage.questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = answer;
        setUserAnswers(newAnswers);
        setSubmitted(false);
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const score = userAnswers.reduce((correctCount, answer, index) => {
        return answer === readingPassage.questions[index].answer ? correctCount + 1 : correctCount;
    }, 0);
    
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Reading Practice</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{readingPassage.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{readingPassage.text}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Questions</h3>
                {readingPassage.questions.map((q, qIndex) => (
                    <div key={qIndex} className="border-t pt-4 border-gray-200 dark:border-gray-700">
                        <p className="font-medium mb-3 text-gray-700 dark:text-gray-300">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option, oIndex) => {
                                const isSelected = userAnswers[qIndex] === option;
                                const isCorrect = q.answer === option;
                                let bgColor = "bg-transparent";

                                if (submitted) {
                                    if (isSelected && isCorrect) bgColor = "bg-green-100 dark:bg-green-900/50";
                                    else if (isSelected && !isCorrect) bgColor = "bg-red-100 dark:bg-red-900/50";
                                    else if (isCorrect) bgColor = "bg-green-100 dark:bg-green-900/50";
                                }

                                return (
                                    <label key={oIndex} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${bgColor}`}>
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={option}
                                            checked={isSelected}
                                            onChange={() => handleAnswerChange(qIndex, option)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {submitted && (
                         <p className="font-semibold text-lg text-gray-800 dark:text-white">Your Score: {score} / {readingPassage.questions.length}</p>
                    )}
                    <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Check Answers
                    </button>
                </div>
            </div>
        </div>
    );
};
