import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class InterviewService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // 1. Pehla Naya/Dynamic Question Shuru Karne Ke Liye
  async startPractice(role: string, level: string) {
    const randomSeed = Date.now(); // Dynamic seed taake har bar naya question aaye

    const systemPrompt = `You are an expert technical interviewer.
    Generate a UNIQUE, RANDOM, and PRACTICAL technical interview question for a candidate applying for "${role}" position at "${level}" level.
    Do NOT repeat common generic default questions. Ask ONLY ONE clear question to start the interview.
    Random Seed: ${randomSeed}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.85,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Start the interview for ${role} (${level} level).` },
      ],
    });

    return {
      message: response.choices[0].message.content,
    };
  }

  // 2. Continuous Chat & Complete Preparation Ke Liye Loop
  async processChat(chatHistory: { role: 'user' | 'assistant' | 'system'; content: string }[], role: string, level: string) {
    const systemPrompt = `You are a strict technical interviewer conducting a full interview for a ${role} (${level} level).
    
    Instructions for each turn:
    1. Briefly evaluate the user's previous answer (highlight what was good and what was missing).
    2. Ask the NEXT logical technical interview question to continue the interview.
    3. Keep answers concise and interactive.
    4. If 5 questions are completed, summarize their performance with a score out of 10 and end the interview.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory, // Is se AI ko poori purani conversation yaad rahe gi
      ],
    });

    return {
      message: response.choices[0].message.content,
    };
  }
}