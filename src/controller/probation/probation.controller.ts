import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common'
import { ProbationService } from './probation.service'

@Controller('probation')
export class ProbationController {
  constructor(private readonly probationService: ProbationService) {}

  @Get()
  async findAll(@Query() query: any) {
    const data = await this.probationService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post()
  create(@Body() body: any) { return this.probationService.create(body) }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.probationService.update(id, body) }
}


