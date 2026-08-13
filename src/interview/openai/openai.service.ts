import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenaiService {
  async generateQuestion(field: string, level: string): Promise<string> {
    // Demo/Mock Question (bina OpenAI API balance ke test karne ke liye)
    return `[Demo Question for ${level} ${field}]: What is Dependency Injection in NestJS and how does it work?`;
  }

  // Controller is method name ko call kar raha hai
  async analyzeAnswer(question: string, answer: string): Promise<any> {
    return {
      technicalScore: 8,
      communicationScore: 9,
      feedback: 'Great answer! You explained the core concept clearly with accurate terminology.',
    };
  }

  // Dual compatibility ke liye evaluateAnswer bhi rakhte hain
  async evaluateAnswer(question: string, answer: string): Promise<any> {
    return this.analyzeAnswer(question, answer);
  }
}