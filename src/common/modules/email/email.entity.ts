import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../db/base.entity.js';
import type { SMTPSentMessageInfo } from 'nodemailer';

export enum EmailStatus {
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

@Entity('email')
export class EmailEntity extends BaseEntity {
  @Column({
    name: 'cancelled_at',
    type: 'datetime',
    precision: 6,
    default: null,
  })
  cancelledAt: Date | null;

  @Column({
    name: 'sent_at',
    type: 'datetime',
    precision: 6,
    default: null,
  })
  sentAt: Date | null;

  @Column({
    name: 'delivered_at',
    type: 'datetime',
    precision: 6,
    default: null,
  })
  deliveredAt: Date | null;

  @Column({
    name: 'read_at',
    type: 'datetime',
    precision: 6,
    default: null,
  })
  readAt: Date | null;

  @Column({
    name: 'failed_at',
    type: 'datetime',
    precision: 6,
    default: null,
  })
  failedAt: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column({
    name: 'from',
    type: 'varchar',
    length: 255,
  })
  from: string;

  @Column({
    name: 'to',
    type: 'varchar',
    length: 255,
  })
  to: string;

  @Column({
    name: 'subject',
    type: 'varchar',
    length: 255,
  })
  subject: string;

  @Column({
    name: 'text',
    type: 'text',
  })
  text: string;

  @Column({
    name: 'html',
    type: 'text',
    nullable: true,
    default: null,
  })
  html: string | null;

  @Column({
    name: 'result_json',
    type: 'simple-json',
    default: null,
    nullable: true,
  })
  resultJson: SMTPSentMessageInfo | null;
}
