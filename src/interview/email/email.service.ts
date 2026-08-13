import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendInterviewReport(email: string, evaluationData: any): Promise<any> {
    const htmlContent = `
      <h2>AI Interview Performance Report</h2>
      <p>Here is your interview feedback summary:</p>
      <ul>
        <li><strong>Technical Score:</strong> ${evaluationData.technicalScore}/10</li>
        <li><strong>Communication Score:</strong> ${evaluationData.communicationScore}/10</li>
      </ul>
      <h3>Feedback:</h3>
      <p>${evaluationData.feedback}</p>
      <h3>Suggestions for Improvement:</h3>
      <p>${evaluationData.improvementTips}</p>
    `;

    return await this.resend.emails.send({
      from: 'AI Interviewer <onboarding@resend.dev>',
      to: [email],
      subject: 'Your AI Interview Practice Results',
      html: htmlContent,
    });
  }
}