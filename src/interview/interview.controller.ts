import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';
import { EmailService } from './email/email.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Interview Practice')
@Controller('interview')
export class InterviewController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly emailService: EmailService,
  ) {}

  @Post('generate-question')
  @ApiOperation({ summary: 'Generate a role-specific interview question' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        field: { type: 'string', example: 'NestJS Backend Developer' },
        level: { type: 'string', example: 'Junior' },
      },
    },
  })
  async generateQuestion(@Body() body: { field: string; level: string }) {
    const question = await this.openaiService.generateQuestion(body.field, body.level);
    return { question };
  }

  @Post('evaluate-answer')
  @ApiOperation({ summary: 'Analyze and grade a candidate response' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string', example: 'What is Dependency Injection in NestJS?' },
        answer: { type: 'string', example: 'It is a design pattern used to increase modularity and reuse.' },
      },
    },
  })
  async evaluateAnswer(@Body() body: { question: string; answer: string }) {
    const evaluation = await this.openaiService.analyzeAnswer(body.question, body.answer);
    return evaluation;
  }

  @Post('send-report')
  @ApiOperation({ summary: 'Send performance report via email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        evaluationData: {
          type: 'object',
          example: {
            technicalScore: 8,
            communicationScore: 9,
            feedback: 'Great technical understanding.',
            improvementTips: 'Practice more on real-world edge cases.',
          },
        },
      },
    },
  })
  async sendReport(@Body() body: { email: string; evaluationData: any }) {
    return await this.emailService.sendInterviewReport(body.email, body.evaluationData);
  }
}