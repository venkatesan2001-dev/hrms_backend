import { Controller, Get, Post, Body } from '@nestjs/common'
import { DepartmentsService } from './departments.service'

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll() {
    const data = await this.departmentsService.findAll()
    return { success: true, data }
  }

  @Post()
  create(@Body() body: any) { return this.departmentsService.create(body) }
}


