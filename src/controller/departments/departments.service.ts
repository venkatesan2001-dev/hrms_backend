import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Department } from './schemas/department.schema'

@Injectable()
export class DepartmentsService {
  constructor(@InjectModel(Department.name) private readonly deptModel: Model<Department>) {}

  findAll() { return this.deptModel.find({}).sort({ createdAt: -1 }).lean().exec() }
  create(dto: any) { return this.deptModel.create(dto) }
}


