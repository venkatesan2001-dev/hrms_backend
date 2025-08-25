import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema({ _id: false })
class AddressDetail {
  @Prop()
  address: string;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  zipcode: number;
}

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({ required: true })
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  employee_id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone_number: string;

  @Prop()
  address_detail: AddressDetail;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  password: string;

  @Prop({
    type: String,
    default: 'STANDARD',
    enum: ['ADMIN', 'STANDARD'],
  })
  role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
