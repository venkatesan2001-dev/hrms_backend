import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

class CtcBreakup {
  @Prop() basic: number
  @Prop() hra: number
  @Prop() allowances: number
  @Prop() variablePay: number
  @Prop() employerPF: number
  @Prop() gratuity: number
  @Prop() totalCTC: number
}

@Schema({ timestamps: true })
export class Offer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Candidate' }) candidateId?: Types.ObjectId
  @Prop() candidateName: string
  @Prop() candidateEmail: string
  @Prop() position: string
  @Prop() joiningDate?: Date
  @Prop() annualCTC: number
  @Prop({ type: CtcBreakup }) breakup: CtcBreakup
  @Prop() offerLetterHtml?: string
  @Prop({ enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'], default: 'DRAFT' }) status: string
}

export const OfferSchema = SchemaFactory.createForClass(Offer)


