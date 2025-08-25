import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Probation } from './schemas/probation.schema'

@Injectable()
export class ProbationService {
  constructor(@InjectModel(Probation.name) private readonly probationModel: Model<Probation>) {}

  findAll(query: any = {}) {
    const { page = 1, limit = 10 } = query
    return this.probationModel.find({}).sort({ createdAt: -1 }).skip((Number(page)-1)*Number(limit)).limit(Number(limit)).lean().exec()
  }

  create(dto: any) {
    const start = new Date(dto.startDate)
    const end = new Date(start)
    const days = Number(dto.durationDays || 90)
    end.setDate(end.getDate() + days)
    return this.probationModel.create({ ...dto, startDate: start, endDate: end })
  }

  update(id: string, dto: any) {
    if (typeof dto.durationDays === 'number' && dto.startDate) {
      const start = new Date(dto.startDate)
      const end = new Date(start)
      end.setDate(end.getDate() + Number(dto.durationDays))
      dto.endDate = end
    }
    return this.probationModel.findByIdAndUpdate(id, dto, { new: true })
  }
}


