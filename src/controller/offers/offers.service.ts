import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer } from './schemas/offer.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private readonly offerModel: Model<Offer>,
  ) {}

  private breakup(ctc: number) {
    const basic = Math.round(ctc * 0.4);
    const hra = Math.round(basic * 0.5);
    const allowances = Math.max(0, Math.round(ctc - (basic + hra)));
    const employerPF = Math.round(Math.min(basic * 0.12, 21600));
    const gratuity = Math.round(basic * 0.0481);
    const variablePay = 0;
    return {
      basic,
      hra,
      allowances,
      employerPF,
      gratuity,
      variablePay,
      totalCTC: ctc,
    };
  }

  private renderHtml(o: any) {
    const b = o.breakup;
    return `<div style="font-family: Arial, sans-serif; padding: 24px;"><h2>Offer Letter</h2><p>Dear ${o.candidateName},</p><p>Position: <strong>${o.position}</strong></p><p>Joining: <strong>${o.joiningDate ? new Date(o.joiningDate).toDateString() : 'TBD'}</strong></p><h3>CTC</h3><ul><li>Basic: ₹${b.basic}</li><li>HRA: ₹${b.hra}</li><li>Allowances: ₹${b.allowances}</li><li>Employer PF: ₹${b.employerPF}</li><li>Gratuity: ₹${b.gratuity}</li><li><strong>Total CTC: ₹${b.totalCTC}</strong></li></ul><p>Regards,<br/>HR Team</p></div>`;
  }

  findAll(query: any = {}) {
    const { page = 1, limit = 10 } = query;
    return this.offerModel
      .find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean()
      .exec();
  }

  async create(dto: any) {
    const breakup = this.breakup(Number(dto.annualCTC || 0));
    const offerLetterHtml = this.renderHtml({ ...dto, breakup });
    return this.offerModel.create({ ...dto, breakup, offerLetterHtml });
  }

  async send(id: string) {
    // const offer = await this.offerModel.findById(id)
    // if (!offer) return null
    // if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    //   const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
    //   const from = SMTP_FROM || SMTP_USER
    //   await transporter.sendMail({ from, to: offer.candidateEmail, subject: 'Offer Letter', html: offer.offerLetterHtml || '' })
    //   offer.status = 'SENT'
    //   await offer.save()
    // }
    // return offer
  }
}
