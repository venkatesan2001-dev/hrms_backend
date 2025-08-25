import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  findAll(query: any = {}) {
    const { page = 1, limit = 10, search = '', role = '', isActive = '' } = query
    const filter: any = {}
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { employeeCode: new RegExp(search, 'i') },
      ]
    }
    if (role) filter.role = role
    if (isActive !== '') filter.isActive = isActive === 'true'
    return this.userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean()
      .exec()
  }

  create(dto: any) { return this.userModel.create(dto) }
  update(id: string, dto: any) { return this.userModel.findByIdAndUpdate(id, dto, { new: true }) }
  delete(id: string) { return this.userModel.findByIdAndDelete(id) }
}


