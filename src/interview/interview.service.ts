import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is missing in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  async startPractice(role: string, level: string) {
    try {
      // Updated model name to gemini-2.5-flash
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `You are an expert interviewer for a ${level} level ${role} position. 
Greeting the candidate politely and ask the FIRST technical interview question directly. Keep the tone professional and question concise.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { question: response.text() };
    } catch (error: any) {
      this.logger.error('Error starting interview with Gemini:', error);
      throw error;
    }
  }

  async processChat(chatHistory: any[], role: string, level: string) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      let formattedHistory = chatHistory
        .map((msg) => `${msg.sender === 'bot' || msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.text || msg.content}`)
        .join('\n');

      const prompt = `You are interviewing a candidate for a ${level} level ${role} role.
Here is the previous conversation history:
${formattedHistory}

Evaluate the candidate's last answer briefly and ask the next follow-up interview question. If enough questions have been asked (around 5-6), conclude the interview politely and inform them to generate the evaluation report.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { reply: response.text() };
    } catch (error: any) {
      this.logger.error('Error in processChat with Gemini:', error);
      throw error;
    }
  }

  async generateReport(chatHistory: any[], role: string, level: string) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      let formattedHistory = chatHistory
        .map((msg) => `${msg.sender === 'bot' || msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.text || msg.content}`)
        .join('\n');

      const prompt = `Analyze this complete technical interview transcript for a ${level} level ${role} position:
${formattedHistory}

Provide a detailed evaluation report including:
1. Overall Performance Score (out of 10)
2. Key Strengths
3. Areas for Improvement
4. Final Hiring Recommendation`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      this.logger.error('Error generating report with Gemini:', error);
      throw error;
    }
  }
}