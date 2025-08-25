import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common'
import { CandidatesService } from './candidates.service'

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  async findAll(@Query() query: any) {
    const data = await this.candidatesService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post()
  create(@Body() body: any) { return this.candidatesService.create(body) }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.candidatesService.update(id, body) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.candidatesService.delete(id) }
}


