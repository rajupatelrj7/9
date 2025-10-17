
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { WritingFeedback } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const writingFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        overallBand: { type: Type.NUMBER, description: "Overall band score from 1.0 to 9.0, in 0.5 increments." },
        taskAchievement: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
            },
            required: ['score', 'feedback'],
        },
        coherenceCohesion: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
            },
            required: ['score', 'feedback'],
        },
        lexicalResource: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
            },
            required: ['score', 'feedback'],
        },
        grammaticalRange: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
            },
            required: ['score', 'feedback'],
        },
        correctedEssay: { type: Type.STRING, description: "The full essay with grammatical corrections and improvements." },
    },
    required: ['overallBand', 'taskAchievement', 'coherenceCohesion', 'lexicalResource', 'grammaticalRange', 'correctedEssay'],
};

export const getWritingFeedback = async (taskType: 'Task 1' | 'Task 2', prompt: string, essay: string): Promise<WritingFeedback> => {
    try {
        const systemInstruction = `You are an expert IELTS examiner. Evaluate the following ${taskType} essay based on the official IELTS writing assessment criteria. Provide a detailed breakdown of the score for each of the four criteria (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy), specific feedback for each, an overall band score, and a corrected version of the essay. The response must be in JSON format.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Prompt: "${prompt}"\n\nEssay:\n"${essay}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: writingFeedbackSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WritingFeedback;
    } catch (error) {
        console.error("Error getting writing feedback:", error);
        throw new Error("Failed to get feedback from AI. Please check your API key and try again.");
    }
};

export const getSpeakingSampleAnswer = async (prompt: string): Promise<string> => {
    try {
        const systemInstruction = "You are an expert IELTS coach providing a model answer for a speaking question. The answer should be a high-scoring Band 9 response, demonstrating a wide range of vocabulary, complex grammatical structures, and fluent, coherent ideas.";
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a sample answer for the following IELTS speaking prompt: "${prompt}"`,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting sample answer:", error);
        throw new Error("Failed to generate a sample answer.");
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
