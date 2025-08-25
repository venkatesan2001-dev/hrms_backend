import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

class Objective { @Prop() title: string; @Prop() description?: string; @Prop() weight?: number }
class Review { @Prop() date?: Date; @Prop({ type: Types.ObjectId, ref: 'User' }) reviewer?: Types.ObjectId; @Prop() comments?: string; @Prop() rating?: number }

@Schema({ timestamps: true })
export class Probation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId
  @Prop({ required: true }) startDate: Date
  @Prop({ required: true }) endDate: Date
  @Prop({ type: [Object], default: [] }) objectives: Objective[]
  @Prop({ type: [Object], default: [] }) reviews: Review[]
  @Prop({ enum: ['ACTIVE', 'CONFIRMED', 'EXTENDED'], default: 'ACTIVE' }) status: string
}

export const ProbationSchema = SchemaFactory.createForClass(Probation)


