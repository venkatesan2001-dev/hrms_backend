import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Onboarding } from './schemas/onboarding.schema'

@Injectable()
export class OnboardingService {
  constructor(@InjectModel(Onboarding.name) private readonly onboardingModel: Model<Onboarding>) {}

  findAll(query: any = {}) {
    const { page = 1, limit = 10 } = query
    return this.onboardingModel.find({}).sort({ createdAt: -1 }).skip((Number(page)-1)*Number(limit)).limit(Number(limit)).lean().exec()
  }

  create(dto: any) { return this.onboardingModel.create(dto) }
  update(id: string, dto: any) { return this.onboardingModel.findByIdAndUpdate(id, dto, { new: true }) }
}


