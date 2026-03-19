import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OfficialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.official.findMany({
      include: { ministry: true, subject: { include: { scores: { where: { axisId: null }, orderBy: { createdAt: "desc" }, take: 1 } } } },
      orderBy: { fullNameAr: "asc" }
    });
  }

  findOne(id: string) {
    return this.prisma.official.findUnique({
      where: { id },
      include: {
        ministry: true,
        attendance: { include: { meeting: true } },
        presenceRecords: true,
        statements: true,
        alignments: { include: { topic: true } },
        subject: { include: { scores: true, indicatorEntries: { include: { indicator: { include: { axis: true } } } } } }
      }
    });
  }
}
