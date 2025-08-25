import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

class ChecklistItem { @Prop() key: string; @Prop() label: string; @Prop({ default: false }) completed: boolean; @Prop() completedAt?: Date }
class DocItem { @Prop() name: string; @Prop() url: string; @Prop() uploadedAt?: Date }

@Schema({ timestamps: true })
export class Onboarding extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' }) userId?: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: 'Candidate' }) candidateId?: Types.ObjectId
  @Prop({ type: [Object], default: [] }) documents: DocItem[]
  @Prop({ type: [Object], default: [] }) checklist: ChecklistItem[]
  @Prop() appointmentLetterUrl?: string
}

export const OnboardingSchema = SchemaFactory.createForClass(Onboarding)


