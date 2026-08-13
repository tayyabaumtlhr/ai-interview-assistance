import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { OpenaiService } from './openai/openai.service';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [InterviewController],
  providers: [InterviewService, OpenaiService, EmailService],
  exports: [InterviewService, OpenaiService, EmailService],
})
export class InterviewModule {}