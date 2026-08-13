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

  async startPractice(role: string, level: string) {
    const randomSeed = Date.now();

    const systemPrompt = `You are a technical interviewer. 
    Generate a UNIQUE, RANDOM, and PRACTICAL interview question for a "${role}" (${level} level).
    Do NOT repeat default questions. Random Seed: ${randomSeed}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.85,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Start the interview for ${role} (${level} level).` },
      ],
    });

    return { message: response.choices[0].message.content };
  }

  async processChat(chatHistory: any[], role: string, level: string) {
    const systemPrompt = `You are a strict technical interviewer for a ${role} (${level} level).
    1. Briefly evaluate the user's previous answer.
    2. Ask the NEXT logical technical interview question.
    3. Keep responses interactive and professional.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
      ],
    });

    return { message: response.choices[0].message.content };
  }
}