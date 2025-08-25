import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common'
import { OnboardingService } from './onboarding.service'

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('records')
  async findAll(@Query() query: any) {
    const data = await this.onboardingService.findAll(query)
    return { success: true, data, pagination: null }
  }

  @Post('records')
  create(@Body() body: any) { return this.onboardingService.create(body) }

  @Put('records/:id')
  update(@Param('id') id: string, @Body() body: any) { return this.onboardingService.update(id, body) }
}


