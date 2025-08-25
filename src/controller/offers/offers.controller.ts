import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common'
import { OffersService } from './offers.service'

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll(@Query() query: any) {
    const data = await this.offersService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post()
  create(@Body() body: any) { return this.offersService.create(body) }

  @Post(':id/send')
  send(@Param('id') id: string) { return this.offersService.send(id) }
}


