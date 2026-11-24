import type { EntityManager, Repository } from 'typeorm';
import { BaseService } from '../../base.service.js';
import { UserEntity } from '../user/user.entity.js';
import { EmailStatus, type EmailEntity } from './email.entity.js';
import {
  BASE_URL,
  JWT_EMAIL_VERIFICATION_SECRET,
  SMTP_FROM_EMAIL,
  SMTP_HOST,
  SMTP_PORT,
} from '../../constants.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../errors.js';
import { sendMail } from '../../lib/mail.lib.js';

export type SendVerificationEmailParams = {
  userId: UserEntity['id'];
  userName: UserEntity['name'];
  userEmail: UserEntity['email'];
};

export interface EmailVerificationPayload extends JwtPayload {
  userId: string;
  email: string;
  purpose: 'email_verification';
}

export default class EmailService extends BaseService<
  EmailEntity,
  Repository<EmailEntity>
> {
  name = 'email';

  constructor(readonly repository: Repository<EmailEntity>) {
    super(repository);
  }

  public async sendVerificationEmail(
    data: SendVerificationEmailParams,
    manager?: EntityManager,
  ) {
    if (!SMTP_HOST || !SMTP_PORT) return;

    const repository = manager
      ? manager.getRepository(this.repository.target)
      : this.repository;

    let email = repository.create({
      subject: 'Email Verification',
      from: SMTP_FROM_EMAIL,
      to: `${data.userName} <${data.userEmail}>`,
      text: '',
    });

    email = await repository.save(email);
    email.text = `Hello ${data.userName},\n\nTo verify your account, please click on the following link: ${BASE_URL}/auth/verify/email/${this.generateEmailVerificationToken(data.userId, email.id, data.userEmail)}`;
    email = await repository.save(email);

    const result = await sendMail(
      email.to,
      email.subject,
      email.text,
      email.html ? email.html : undefined,
    );

    email.resultJson = result ? result : null;

    if (result) {
      email.sentAt =
        result.accepted.length > 0 && result.response.includes('250')
          ? new Date()
          : null;
      email.status = EmailStatus.SENT;
    } else {
      email.failedAt = new Date();
      email.status = EmailStatus.FAILED;
    }

    return await repository.save(email);
  }

  public async verifyEmailVerificationToken(token: string) {
    try {
      if (!JWT_EMAIL_VERIFICATION_SECRET)
        throw new InternalServerError(
          'JWT_EMAIL_VERIFICATION_SECRET is not defined',
        );

      const decoded: string | JwtPayload = jwt.verify(
        token,
        JWT_EMAIL_VERIFICATION_SECRET,
      );

      if (
        typeof decoded === 'string' ||
        decoded.purpose !== 'email_verification' ||
        typeof decoded.userId !== 'string' ||
        typeof decoded.emailId !== 'string' ||
        typeof decoded.email !== 'string'
      )
        throw new BadRequestError('Invalid email verification token');

      const email = await this.repository.findOne({
        where: {
          id: decoded.emailId,
        },
      });

      if (!email) throw new NotFoundError('Email not found');

      email.status = EmailStatus.READ;
      email.readAt = new Date();

      await this.repository.save(email);

      await this.repository.manager
        .getRepository(UserEntity)
        .update(decoded.userId, {
          isEmailVerified: true,
        });

      return {
        userId: decoded.userId,
        email: decoded.email,
        purpose:
          decoded.purpose as unknown as EmailVerificationPayload['purpose'],
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }

      console.error(error);

      throw new InternalServerError('Failed to verify email token');
    }
  }

  private generateEmailVerificationToken(
    userId: string,
    emailId: string,
    email: string,
    expiresIn: jwt.SignOptions['expiresIn'] = '1h',
  ): string {
    const payload: EmailVerificationPayload = {
      userId,
      emailId,
      email,
      purpose: 'email_verification',
    };

    if (!JWT_EMAIL_VERIFICATION_SECRET)
      throw new InternalServerError(
        'JWT_EMAIL_VERIFICATION_SECRET is not defined',
      );

    return jwt.sign(payload, JWT_EMAIL_VERIFICATION_SECRET, { expiresIn });
  }
}
