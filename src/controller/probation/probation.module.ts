import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProbationService } from './probation.service'
import { ProbationController } from './probation.controller'
import { Probation, ProbationSchema } from './schemas/probation.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Probation.name, schema: ProbationSchema }])],
  controllers: [ProbationController],
  providers: [ProbationService],
})
export class ProbationModule {}


