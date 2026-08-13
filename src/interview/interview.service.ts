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

    const systemPrompt = `You are a professional technical interviewer.
    Generate a UNIQUE and SPECIFIC technical interview question for a "${role}" at "${level}" level.
    Do NOT ask basic generic intro questions. Ask a practical technical question.
    Random seed to avoid repeating: ${randomSeed}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Start the interview for ${role} (${level} level).` },
      ],
    });

    return { message: response.choices[0].message.content };
  }

  async processChat(chatHistory: any[], role: string, level: string) {
    const systemPrompt = `You are an expert technical interviewer conducting an interview for a ${role} (${level} level).
    Your rules:
    1. Evaluate the user's last answer in 1-2 lines (mention what was correct or missing).
    2. Ask the NEXT relevant technical interview question.
    3. Keep responses structured and concise.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.75,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
      ],
    });

    return { message: response.choices[0].message.content };
  }
}