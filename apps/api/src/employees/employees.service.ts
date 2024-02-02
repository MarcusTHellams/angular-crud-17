import { Injectable } from '@nestjs/common';
import { Prisma, PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({
      data: createEmployeeDto,
    });
  }

  findAll() {
    return this.prisma.employee.findMany();
  }

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: {
        employeeId: id,
      },
    });
  }

  update(id: string, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
      where: {
        employeeId: id,
      },
      data: updateEmployeeDto,
    });
  }

  remove(id: string) {
    return this.prisma.employee.delete({
      where: {
        employeeId: id,
      },
    });
  }
}
