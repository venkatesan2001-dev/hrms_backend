import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Candidate } from './schemas/candidate.schema'

@Injectable()
export class CandidatesService {
  constructor(@InjectModel(Candidate.name) private readonly candidateModel: Model<Candidate>) {}

  findAll(query: any = {}) {
    const { page = 1, limit = 10, search = '' } = query
    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
      ]
    }
    return this.candidateModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean()
      .exec()
  }

  create(dto: any) { return this.candidateModel.create(dto) }
  update(id: string, dto: any) { return this.candidateModel.findByIdAndUpdate(id, dto, { new: true }) }
  delete(id: string) { return this.candidateModel.findByIdAndDelete(id) }
}


