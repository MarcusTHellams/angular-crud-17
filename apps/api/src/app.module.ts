import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmployeesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
