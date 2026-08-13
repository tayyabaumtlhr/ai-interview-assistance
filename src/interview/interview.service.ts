import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class InterviewService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Apni .env file se API Key lega
    });
  }

  async startPractice(role: string, level: string) {
    // Unique seed add karne se AI har millisecond par naya response deta hai
    const randomSeed = Date.now();

    const systemPrompt = `You are a technical interviewer conducting a live coding interview.
    Generate a UNIQUE, RANDOM, and DYNAMIC technical interview question for a "${role}" position at "${level}" level.
    Do NOT repeat common generic default questions. 
    Make sure the question tests practical knowledge.
    Random Context Seed: ${randomSeed}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // ya 'gpt-4o'
      temperature: 0.85,      // High temperature guarantees randomness
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Start the interview for ${role} (${level} level). Ask me the first question.` },
      ],
    });

    return {
      message: response.choices[0].message.content,
    };
  }
}