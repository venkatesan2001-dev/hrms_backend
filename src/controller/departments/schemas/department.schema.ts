import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Department extends Document {
  @Prop({ required: true }) name: string
  @Prop({ required: true, unique: true }) code: string
  @Prop() description?: string
  @Prop({ default: 'active' }) status: string
}

export const DepartmentSchema = SchemaFactory.createForClass(Department)


