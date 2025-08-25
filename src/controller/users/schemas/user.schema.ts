import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) firstName: string
  @Prop({ required: true }) lastName: string
  @Prop({ required: true, unique: true }) email: string
  @Prop({ required: true, unique: true }) employeeCode: string
  @Prop({ enum: ['EMPLOYEE', 'ADMIN', 'MANAGER'], default: 'EMPLOYEE' }) role: string
  @Prop({ default: true }) isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)


