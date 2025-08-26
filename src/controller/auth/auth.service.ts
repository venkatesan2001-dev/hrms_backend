import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  async findOne(payload: {}): Promise<any> {
    const data = await this.employeeService.findOne(payload);
    return data;
  }
  async findOneEmployee(payload: {}): Promise<any> {
    const user = await this.employeeService.findOne({
      employee_id: payload['employee_id'],
    });
    if (user) {
      let data = await this.employeeService.pbkdf2Promise(
        payload['password'],
        process.env.HASH_SECRET_KEY,
      );
      if (data === user.password) return user;
    }
  }

  async hashPassword(password: string) {
    const data = await this.employeeService.pbkdf2Promise(
      password,
      process.env.HASH_SECRET_KEY,
    );
    return data;
  }

  async changePassword(id: string, password: string, payload): Promise<any> {
    const where = { _id: id };
    payload.password = await this.hashPassword(password);
    return this.employeeService.findByIdAndUpdate(where, payload);
  }
}
