import { Controller, Post, Body } from '@nestjs/common';
import { InterviewService } from './interview.service'; // Apne service file path ke mutabiq adjust karein

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // 1. Pehla Question mangwane ke liye
  @Post('start')
  async startInterview(@Body() body: { role: string; level: string }) {
    return this.interviewService.startPractice(body.role, body.level);
  }

  // 2. Continuing Conversation / Answer bhejne aur agla Question mangwane ke liye
  @Post('chat')
  async processChat(
    @Body() body: { chatHistory: { role: 'user' | 'assistant' | 'system'; content: string }[]; role: string; level: string },
  ) {
    return this.interviewService.processChat(body.chatHistory, body.role, body.level);
  }
}