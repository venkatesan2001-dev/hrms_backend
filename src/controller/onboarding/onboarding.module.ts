import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OnboardingService } from './onboarding.service'
import { OnboardingController } from './onboarding.controller'
import { Onboarding, OnboardingSchema } from './schemas/onboarding.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Onboarding.name, schema: OnboardingSchema }])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}


