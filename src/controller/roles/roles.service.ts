import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role } from './schemas/role.schema'

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) {}

  findAll(query: any = {}) {
    const { page = 1, limit = 50 } = query
    return this.roleModel
      .find({})
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean()
      .exec()
  }

  create(dto: any) { return this.roleModel.create(dto) }
}


