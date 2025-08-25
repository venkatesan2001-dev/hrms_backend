import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { RolesService } from './roles.service'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(@Query() query: any) {
    const data = await this.rolesService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post()
  create(@Body() body: any) { return this.rolesService.create(body) }
}


