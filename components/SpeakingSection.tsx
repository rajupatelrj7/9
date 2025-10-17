
import React, { useState, useCallback, useEffect } from 'react';
import { SPEAKING_PROMPTS } from '../constants';
import { generateSpeech, getSpeakingSampleAnswer } from '../services/geminiService';
import { decodeAudioData, decodeBase64 } from '../utils/audioUtils';
import { VolumeUpIcon, LightBulbIcon } from './icons';

let audioContext: AudioContext | null = null;

export const SpeakingSection: React.FC = () => {
    const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
    const [sampleAnswer, setSampleAnswer] = useState('');
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    }, []);

    const playAudio = useCallback(async (text: string) => {
        if (!audioContext) return;
        setIsSpeaking(true);
        try {
            const base64Audio = await generateSpeech(text);
            if (base64Audio) {
                const audioBytes = decodeBase64(base64Audio);
                const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
                source.onended = () => setIsSpeaking(false);
            } else {
                setError("Could not generate audio.");
                setIsSpeaking(false);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to play audio.");
            setIsSpeaking(false);
        }
    }, []);

    const handleShowAnswer = useCallback(async (promptText: string) => {
        setIsLoadingAnswer(true);
        setSampleAnswer('');
        setError(null);
        try {
            const answer = await getSpeakingSampleAnswer(promptText);
            setSampleAnswer(answer);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to get sample answer.");
        } finally {
            setIsLoadingAnswer(false);
        }
    }, []);

    const currentPrompt = SPEAKING_PROMPTS[selectedPromptIndex];
    const fullPromptText = currentPrompt.part === "Part 2" ? currentPrompt.cueCard : currentPrompt.questions.join(" ");

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Speaking Practice</h2>
            
            <div className="flex justify-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                {SPEAKING_PROMPTS.map((prompt, index) => (
                    <button
                        key={prompt.part}
                        onClick={() => {setSelectedPromptIndex(index); setSampleAnswer(''); setError(null);}}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${selectedPromptIndex === index ? 'bg-white dark:bg-gray-900 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                        {prompt.part}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{currentPrompt.topic}</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {currentPrompt.part === "Part 2" ?
                        <p>{currentPrompt.cueCard}</p> :
                        currentPrompt.questions.map((q, i) => <p key={i}>{q}</p>)
                    }
                </div>

                <div className="mt-6 flex items-center space-x-4">
                    <button 
                        onClick={() => playAudio(fullPromptText)}
                        disabled={isSpeaking}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                    >
                        <VolumeUpIcon className="w-5 h-5"/>
                        {isSpeaking ? 'Speaking...' : 'Hear Question'}
                    </button>
                    <button 
                        onClick={() => handleShowAnswer(fullPromptText)}
                        disabled={isLoadingAnswer}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        <LightBulbIcon className="w-5 h-5"/>
                        {isLoadingAnswer ? 'Generating...' : 'Show Sample Answer'}
                    </button>
                </div>

                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">{error}</div>}

                {isLoadingAnswer && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-500">Generating a Band 9 sample answer...</p>
                    </div>
                )}
                {sampleAnswer && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Sample Answer</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{sampleAnswer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
