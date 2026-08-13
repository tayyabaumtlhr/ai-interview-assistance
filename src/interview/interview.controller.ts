import { Controller, Post, Body, InternalServerErrorException, Logger } from '@nestjs/common';
import { InterviewService } from './interview.service';

@Controller('interview')
export class InterviewController {
  private readonly logger = new Logger(InterviewController.name);

  constructor(private readonly interviewService: InterviewService) {}

  @Post('start')
  async start(@Body() body: { role: string; level: string }) {
    try {
      this.logger.log(`Starting interview for Role: ${body.role}, Level: ${body.level}`);
      return await this.interviewService.startPractice(body.role, body.level);
    } catch (error: any) {
      this.logger.error('Error in /interview/start:', error);
      const errorMsg = (error as any)?.message || 'Failed to start practice session. Check OpenAI API Key.';
      throw new InternalServerErrorException(errorMsg);
    }
  }

  @Post('chat')
  async chat(@Body() body: { chatHistory: any[]; role: string; level: string }) {
    try {
      return await this.interviewService.processChat(body.chatHistory, body.role, body.level);
    } catch (error: any) {
      this.logger.error('Error in /interview/chat:', error);
      const errorMsg = (error as any)?.message || 'Failed to process answer.';
      throw new InternalServerErrorException(errorMsg);
    }
  }

  @Post('send-report')
  async sendReport(@Body() body: { email: string; role: string; level: string; chatHistory: any[] }) {
    try {
      const report = await this.interviewService.generateReport(body.chatHistory, body.role, body.level);
      return { success: true, message: 'Report generated successfully', report };
    } catch (error: any) {
      this.logger.error('Error in /interview/send-report:', error);
      const errorMsg = (error as any)?.message || 'Failed to generate evaluation report.';
      throw new InternalServerErrorException(errorMsg);
    }
  }

  @Post('send-email')
  async sendEmail(@Body() body: { email: string; role: string; level: string; chatHistory: any[] }) {
    try {
      const report = await this.interviewService.generateReport(body.chatHistory, body.role, body.level);
      return { success: true, message: 'Report sent successfully', report };
    } catch (error: any) {
      this.logger.error('Error in /interview/send-email:', error);
      const errorMsg = (error as any)?.message || 'Failed to send email.';
      throw new InternalServerErrorException(errorMsg);
    }
  }
}