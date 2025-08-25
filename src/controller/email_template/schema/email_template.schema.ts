import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class EmailTemplate {
  @Prop()
  name: string;

  @Prop()
  name_var: string;

  @Prop()
  subject: string;

  @Prop()
  content: string;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
