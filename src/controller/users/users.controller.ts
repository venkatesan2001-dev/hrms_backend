import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: any) {
    const data = await this.usersService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post()
  create(@Body() body: any) { return this.usersService.create(body) }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.usersService.update(id, body) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.usersService.delete(id) }
}


