import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
  HttpException,
  Put,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeDto,
  GetState,
  UpdateEmployeeDto,
} from './dto/create-employee.dto';
import { CommonInterceptor } from 'src/common.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { DefaultMessage, ResponseStatus } from 'src/constants';
import { getFieldsForSearch, getFiltersObject } from 'src/utils/querybuilder';
import { AdminAuthGuard } from '../auth/adminauth.guard';
import { isValidObjectId } from 'mongoose';
import country from '../../utils/country-state-city/country.json';
import state from '../../utils/country-state-city/state.json';
// import city from '../../utils/country-state-city/country.json';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  async idValidate(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new HttpException(
          DefaultMessage.NOT_EXISTS,
          ResponseStatus.BAD_REQUEST,
        );
      }
      const res = await this.employeeService.findOne({
        _id: id,
      });
      if (!res) {
        throw new HttpException(
          DefaultMessage.NOT_EXISTS,
          ResponseStatus.BAD_REQUEST,
        );
      }
      return res;
    } catch {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  async emailValidate(payload, request, id = null) {
    if (request.method == 'PUT' && !id) {
      throw new HttpException(
        DefaultMessage.ID_MANDATORY,
        ResponseStatus.BAD_REQUEST,
      );
    }
    const arg =
      request.method == 'PUT'
        ? {
            email: payload.email,
            _id: { $ne: id },
          }
        : {
            email: payload.email,
          };

    const res = await this.employeeService.findOne(arg);
    if (res) {
      throw new HttpException(
        DefaultMessage.EMAIL_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
    return res;
  }

  async getEmployeeId() {
    let employee_id: string;
    const findlast_user = await this.employeeService.findLast();
    if (findlast_user && findlast_user.employee_id) {
      const splitted_number = findlast_user.employee_id.split('VIVA')[1];
      const number = Number(splitted_number) + 1;
      const result = number.toString().padStart(3, '0');
      employee_id = DefaultMessage.EMPLOYEE_ID_PREFIX + result;
    } else {
      const number = 1;
      const result = number.toString().padStart(3, '0');
      employee_id = DefaultMessage.EMPLOYEE_ID_PREFIX + result;
    }
    return employee_id;
  }
  @Post('/new')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async createEmployee(
    @Body() body: CreateEmployeeDto,
    @Req() req: Express.Request,
  ) {
    try {
      console.log(CreateEmployeeDto, 'CreateEmployeeDto');
      await this.emailValidate(body, req);
      const employee_id = await this.getEmployeeId();
      await this.employeeService.create({ employee_id, ...body });
      return {
        success: true,
        data: {
          message: 'Employee created successfully',
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/index')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async findAllEmployee(@Body() body) {
    try {
      const fields = getFieldsForSearch(body, ['first_name']);
      const payload = getFiltersObject(body, fields);
      const data = await this.employeeService.findAll(payload);
      return {
        success: true,
        data: { data: data, message: 'Records fetched successfully' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }
  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async updateEmployee(
    @Body() body: UpdateEmployeeDto,
    @Param('id') id,
    @Req() req: Express.Request,
  ) {
    await this.idValidate(id);
    await this.emailValidate(body, req, id);
    const where = { _id: id };
    try {
      const data = await this.employeeService.findByIdAndUpdate(where, body);
      const res = data.toObject();
      delete res.password;
      return {
        success: true,
        data: {
          data: res,
          message: 'Employee updated successfully',
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get_country')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async getCountry() {
    try {
      return {
        success: true,
        data: {
          data: country,
          message: 'Record fetched successfully',
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get_state')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async getState(@Query() query: GetState) {
    try {
      const { country_name } = query;
      const country_id = country.find((e) => {
        return e.name.toLowerCase() === country_name.toLowerCase();
      })?._id;
      const data = state.filter((e) => {
        return e.country_id === country_id;
      });
      return {
        success: true,
        data: { data: data, message: 'Record fetched successfully' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }
}
