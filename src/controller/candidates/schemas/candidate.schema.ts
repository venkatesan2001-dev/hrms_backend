import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

class InterviewResult {
  @Prop({ enum: ['PENDING', 'PASS', 'FAIL'], default: 'PENDING' }) status: string
  @Prop() remarks?: string
  @Prop() date?: Date
}

@Schema({ timestamps: true })
export class Candidate extends Document {
  @Prop({ required: true }) name: string
  @Prop({ required: true }) email: string
  @Prop() phone?: string
  @Prop() position?: string
  @Prop() resumeUrl?: string
  @Prop({ enum: ['NEW', 'SHORTLISTED', 'TECH_PASS', 'TECH_FAIL', 'HR_PASS', 'HR_FAIL', 'ASSIGNMENT_PENDING', 'ASSIGNMENT_PASS', 'ASSIGNMENT_FAIL', 'REJECTED', 'SELECTED', 'JOINED'], default: 'NEW' }) status: string
  @Prop({ type: InterviewResult, default: {} }) technical: InterviewResult
  @Prop({ type: InterviewResult, default: {} }) hr: InterviewResult
  @Prop({ type: InterviewResult, default: {} }) assignment: InterviewResult
  @Prop() dateOfJoining?: Date
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate)


