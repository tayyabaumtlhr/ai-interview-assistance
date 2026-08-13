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

  // Pehla Question
  async startPractice(role: string, level: string) {
    const randomSeed = Date.now();

    const systemPrompt = `You are a strict and highly professional technical interviewer for the role of "${role}" (${level} level).
    Task: Ask ONLY ONE initial, highly practical and realistic technical question related to ${role}. 
    Do NOT give introductory greetings or ask "Tell me about yourself". Jump straight into the first core technical question.
    Unique ID: ${randomSeed}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.85,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Start technical interview for ${role} (${level}).` },
      ],
    });

    return { message: response.choices[0].message.content };
  }

  // Agla Dynamic Question + Feedback
  async processChat(chatHistory: any[], role: string, level: string) {
    const systemPrompt = `You are an expert interviewer conducting a live interview for a ${role} (${level} level).
    Instructions:
    1. Briefly evaluate the candidate's last answer (1-2 lines maximum - mention what was correct or missing).
    2. Immediately ask the NEXT DIFFERENT technical question related to ${role}. NEVER repeat previous questions.
    3. Keep questions progressive (moving from basic concepts to scenario-based problems).`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.8,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
      ],
    });

    return { message: response.choices[0].message.content };
  }

  // Detailed Report for Email
  async generateReport(chatHistory: any[], role: string, level: string) {
    const prompt = `Analyze this interview transcript for a ${role} (${level} level) position:
    ${JSON.stringify(chatHistory)}

    Generate a detailed performance report including:
    1. Overall Score (out of 10)
    2. Key Strengths
    3. Areas for Improvement
    4. Model Answers for missed questions`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  }
}